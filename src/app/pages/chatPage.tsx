import { useEffect, useState, useRef, useCallback } from 'react'
import { useSearchParams, useNavigate } from 'react-router'
import { Header } from '../components/header'
import { Footer } from '../components/footer'
import {
  messageApi,
  authApi,
  vehicleApi,
  purchaseApi,
  type ChatRoom,
  type MessageData,
  type UserData,
  type Vehicle,
  type Purchase,
} from '../services/api'
import {
  Send,
  Car,
  MessageSquare,
  ArrowLeft,
  CheckCircle,
  XCircle,
  Clock,
  ExternalLink,
  AlertTriangle,
} from 'lucide-react'
import { formatCurrency } from '../services/utils'
import { io, Socket } from 'socket.io-client'

const SOCKET_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000'
const PURCHASE_POLL_MS = 5000 // atualiza status a cada 5s

// ─── Status Badge ────────────────────────────────────────────────────────────
function StatusBadge({ status }: { status: Purchase['status'] }) {
  if (status === 'pending')
    return (
      <span className="inline-flex items-center gap-1.5 text-xs font-medium px-2.5 py-1 rounded-full bg-amber-100 text-amber-700 border border-amber-200">
        <Clock className="size-3" />
        Pendente
      </span>
    )
  if (status === 'completed')
    return (
      <span className="inline-flex items-center gap-1.5 text-xs font-medium px-2.5 py-1 rounded-full bg-emerald-100 text-emerald-700 border border-emerald-200">
        <CheckCircle className="size-3" />
        Concluída
      </span>
    )
  return (
    <span className="inline-flex items-center gap-1.5 text-xs font-medium px-2.5 py-1 rounded-full bg-red-100 text-red-700 border border-red-200">
      <XCircle className="size-3" />
      Cancelada
    </span>
  )
}

// ─── Main Component ──────────────────────────────────────────────────────────
export function ChatPage() {
  const navigate = useNavigate()
  const [searchParams, setSearchParams] = useSearchParams()
  const chatIdFromUrl = searchParams.get('id')
  const vehicleIdFromUrl = searchParams.get('vehicleId')

  const [user, setUser] = useState<UserData | null>(null)
  const [chats, setChats] = useState<ChatRoom[]>([])
  const [activeChatId, setActiveChatId] = useState<string | null>(chatIdFromUrl)
  const [pendingVehicle, setPendingVehicle] = useState<Vehicle | null>(null)
  const [messages, setMessages] = useState<MessageData[]>([])
  const [newMessage, setNewMessage] = useState('')
  const [loadingChats, setLoadingChats] = useState(true)
  const [sending, setSending] = useState(false)

  // Purchase state
  const [purchase, setPurchase] = useState<Purchase | null>(null)
  const [loadingPurchase, setLoadingPurchase] = useState(false)
  const [updatingStatus, setUpdatingStatus] = useState(false)

  // Modal de confirmação do vendedor
  const [showConfirmModal, setShowConfirmModal] = useState(false)
  const [pendingAction, setPendingAction] = useState<'completed' | 'cancelled' | null>(null)

  // Toast de sucesso
  const [successToast, setSuccessToast] = useState<string | null>(null)

  const messagesEndRef = useRef<HTMLDivElement>(null)
  const socketRef = useRef<Socket | null>(null)
  const pollRef = useRef<ReturnType<typeof setInterval> | null>(null)

  // ── Auth ─────────────────────────────────────────────────────────────────
  useEffect(() => {
    if (!authApi.isLoggedIn()) {
      navigate('/login')
      return
    }
    authApi.getMe().then(setUser).catch(() => navigate('/login'))
  }, [])

  // ── Socket ───────────────────────────────────────────────────────────────
  useEffect(() => {
    socketRef.current = io(SOCKET_URL)
    return () => {
      socketRef.current?.disconnect()
    }
  }, [activeChatId])

  // ── Carrega chats ─────────────────────────────────────────────────────────
  useEffect(() => {
    messageApi.getMyChats()
      .then((res: ChatRoom[]) => {
        setChats(res)
        if (vehicleIdFromUrl) {
          const existingChat = res.find(c => c.vehicleId === vehicleIdFromUrl)
          if (existingChat) {
            setActiveChatId(existingChat.id)
            setSearchParams({ id: existingChat.id })
          } else {
            vehicleApi.getVehicleById(vehicleIdFromUrl)
              .then(setPendingVehicle)
              .catch((err: any) => console.error(err))
          }
        } else if (!activeChatId && res.length > 0) {
          setActiveChatId(res[0].id)
        }
      })
      .catch((err: any) => console.error(err))
      .finally(() => setLoadingChats(false))
  }, [vehicleIdFromUrl])

  // ── Busca purchase associado ao chat ativo ────────────────────────────────
  const fetchPurchaseForChat = useCallback(async (chat: ChatRoom, currentUser: UserData) => {
    try {
      // Busca nas compras do usuário o que bate com este vehicleId e este chat
      let purchases: Purchase[] = []
      const isBuyer = chat.buyerId === currentUser.id
      if (isBuyer) {
        purchases = await purchaseApi.getMyPurchases()
      } else {
        purchases = await purchaseApi.getMySales()
      }
      const found = purchases.find(p => p.vehicleId === chat.vehicleId)
      setPurchase(found ?? null)
    } catch {
      setPurchase(null)
    }
  }, [])

  useEffect(() => {
    if (!activeChatId || !user) return
    const chat = chats.find(c => c.id === activeChatId)
    if (!chat) return

    // Busca imediata
    setLoadingPurchase(true)
    fetchPurchaseForChat(chat, user).finally(() => setLoadingPurchase(false))

    // Polling para atualização em tempo real do status
    pollRef.current = setInterval(() => {
      fetchPurchaseForChat(chat, user)
    }, PURCHASE_POLL_MS)

    return () => {
      if (pollRef.current) clearInterval(pollRef.current)
    }
  }, [activeChatId, user, chats, fetchPurchaseForChat])

  // ── Mensagens ─────────────────────────────────────────────────────────────
  useEffect(() => {
    if (!activeChatId) return
    setPendingVehicle(null)

    messageApi.getChatHistory(activeChatId)
      .then((res: MessageData[]) => setMessages(res))
      .catch((err: any) => console.error(err))

    socketRef.current?.emit('join_chat', { chatId: activeChatId })
    socketRef.current?.on('receive_message', (incomingMessage: MessageData) => {
      if (incomingMessage.chatId === activeChatId) {
        setMessages((prev) => {
          if (prev.some(m => m.id === incomingMessage.id)) return prev
          return [...prev, incomingMessage]
        })
      }
    })

    return () => {
      socketRef.current?.off('receive_message')
    }
  }, [activeChatId])

  // ── Scroll automático ────────────────────────────────────────────────────
  useEffect(() => {
    if (messages.length > 0) {
      messagesEndRef.current?.scrollIntoView({ behavior: 'smooth', block: 'nearest' })
    }
  }, [messages])

  // ── Selecionar chat ───────────────────────────────────────────────────────
  const handleSelectChat = (id: string) => {
    setPendingVehicle(null)
    setPurchase(null)
    setActiveChatId(id)
    navigate(`/chat?id=${id}`, { replace: true })
  }

  // ── Enviar mensagem ───────────────────────────────────────────────────────
  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!newMessage.trim() || !user) return

    let currentVehicleId = vehicleIdFromUrl
    if (activeChatId) {
      const currentChat = chats.find(c => c.id === activeChatId)
      if (currentChat) currentVehicleId = currentChat.vehicleId
    }
    if (!currentVehicleId) return

    setSending(true)
    try {
      const sent = await messageApi.sendMessage({
        vehicleId: currentVehicleId,
        content: newMessage.trim(),
        chatId: activeChatId || undefined,
      })

      setMessages((prev) => {
        if (prev.some(m => m.id === sent.id)) return prev
        return [...prev, sent]
      })
      setNewMessage('')

      if (!activeChatId) {
        setActiveChatId(sent.chatId)
        navigate(`/chat?id=${sent.chatId}`, { replace: true })
        messageApi.getMyChats().then(setChats)
      }
    } catch (err) {
      console.error(err)
    } finally {
      setSending(false)
    }
  }

  // ── Atualizar status (vendedor) ───────────────────────────────────────────
  const handleClickStatusAction = (action: 'completed' | 'cancelled') => {
    setPendingAction(action)
    setShowConfirmModal(true)
  }

  const handleConfirmStatus = async () => {
    if (!pendingAction || !purchase) return
    setShowConfirmModal(false)
    setUpdatingStatus(true)
    try {
      const res = await purchaseApi.updatePurchaseStatus(purchase.id, pendingAction)
      setPurchase(res.data)

      // Refetch chats após mudança de status (backend pode cancelar concorrentes)
      messageApi.getMyChats().then(setChats)

      if (pendingAction === 'completed') {
        showToast('Venda concluída com sucesso! 🎉')
      } else {
        showToast('Venda cancelada.')
      }
    } catch (err: any) {
      console.error(err)
      showToast('Erro ao atualizar status. Tente novamente.')
    } finally {
      setUpdatingStatus(false)
      setPendingAction(null)
    }
  }

  const showToast = (msg: string) => {
    setSuccessToast(msg)
    setTimeout(() => setSuccessToast(null), 4000)
  }

  // ── Helpers ───────────────────────────────────────────────────────────────
  const activeChat = chats.find(c => c.id === activeChatId)
  const showChatWindow = activeChat || pendingVehicle
  const isBuyer = activeChat ? activeChat.buyerId === user?.id : false
  const isSeller = activeChat ? activeChat.sellerId === user?.id : false

  // ── INTERFACE ─────────────────────────────────────────────────────────────
  return (
    <div className="min-h-screen bg-background flex flex-col font-sans">
      <Header user={user} />

      <main className="container mx-auto px-4 py-6 flex gap-4 max-w-7xl h-[800px] min-h-0 box-border">

        {/* ── Barra lateral de conversas ─────────────────────────────────── */}
        <div className={`w-full md:w-80 border border-border rounded-xl flex flex-col bg-card overflow-hidden h-full max-h-full min-h-0 shrink-0 ${showChatWindow && 'hidden md:flex'}`}>
          <div className="p-4 border-b border-border bg-muted/50 shrink-0">
            <h2 className="font-bold text-lg flex items-center gap-2 text-foreground">
              <MessageSquare className="size-5 text-red-600" /> Minhas Conversas
            </h2>
          </div>

          <div className="flex-1 overflow-y-auto divide-y divide-border">
            {loadingChats ? (
              <p className="p-4 text-sm text-muted-foreground text-center animate-pulse">Carregando salas...</p>
            ) : chats.length === 0 && !pendingVehicle ? (
              <p className="p-4 text-sm text-muted-foreground text-center">Nenhum chat iniciado ainda.</p>
            ) : (
              <>
                {pendingVehicle && (
                  <div className="w-full p-4 text-left flex flex-col gap-1 bg-red-50/20 border-r-4 border-red-400 opacity-70 animate-pulse">
                    <span className="font-semibold text-sm text-foreground">{pendingVehicle.owner?.fullName || 'Vendedor'}</span>
                    <span className="text-xs text-muted-foreground truncate">{pendingVehicle.title}</span>
                  </div>
                )}
                {chats.map((room) => {
                  const isBuyerRoom = room.buyerId === user?.id
                  const talkTo = isBuyerRoom ? room.seller.fullName : room.buyer.fullName
                  return (
                    <button
                      key={room.id}
                      onClick={() => handleSelectChat(room.id)}
                      className={`w-full p-4 text-left flex flex-col gap-1 transition-colors hover:bg-muted/60 ${room.id === activeChatId ? 'bg-red-50/40 border-r-4 border-red-600' : ''}`}
                    >
                      <span className="font-semibold text-sm text-foreground">{talkTo}</span>
                      <span className="text-xs text-muted-foreground truncate">{room.vehicle?.title || 'Veículo'}</span>
                    </button>
                  )
                })}
              </>
            )}
          </div>
        </div>

        {/* ── Janela do chat ─────────────────────────────────────────────── */}
        <div className={`flex-1 border border-border rounded-xl flex flex-col bg-card overflow-hidden h-full max-h-full min-h-0 ${!showChatWindow && 'hidden md:flex'}`}>
          {showChatWindow ? (
            <>
              {/* Header do chat */}
              <div className="p-4 border-b border-border bg-muted/30 flex items-center justify-between shrink-0">
                <div className="flex items-center gap-3">
                  <button onClick={() => navigate('/chat')} className="md:hidden p-1 text-muted-foreground hover:text-foreground">
                    <ArrowLeft className="size-5" />
                  </button>
                  <div>
                    <h3 className="font-bold text-sm text-foreground">
                      {activeChat
                        ? (activeChat.buyerId === user?.id ? activeChat.seller.fullName : activeChat.buyer.fullName)
                        : (pendingVehicle?.owner?.fullName || 'Vendedor')}
                    </h3>
                  </div>
                </div>

                {/* Status badge */}
                {purchase && !loadingPurchase && (
                  <StatusBadge status={purchase.status} />
                )}
                {loadingPurchase && (
                  <span className="text-xs text-muted-foreground animate-pulse">Carregando...</span>
                )}
              </div>

              {/* Mini vehicle info */}
              {(activeChat || pendingVehicle) && (
                <div className="flex items-center gap-4 p-4 border-b border-border bg-muted/20 shrink-0">
                  <Car className="size-6 text-primary shrink-0" />
                  <div className="flex-1 min-w-0">
                    <h4 className="font-medium text-sm text-foreground truncate">
                      {activeChat ? activeChat.vehicle?.title : pendingVehicle?.title}
                    </h4>
                    <p className="text-xs text-muted-foreground">
                      {formatCurrency(activeChat ? activeChat.vehicle?.price || 0 : pendingVehicle?.price || 0)}
                    </p>
                  </div>
                </div>
              )}

              {/* ── Barra de ações da compra ──────────────────────────────── */}
              {purchase && activeChat && (
                <div className="shrink-0 border-b border-border bg-card px-4 py-3">

                  {/* Vendedor com compra PENDENTE: botões de aceitar/cancelar */}
                  {isSeller && purchase.status === 'pending' && (
                    <div className="flex flex-wrap items-center gap-2">
                      <span className="text-xs text-muted-foreground mr-auto">Ação da venda:</span>
                      <button
                        onClick={() => handleClickStatusAction('completed')}
                        disabled={updatingStatus}
                        className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium rounded-md bg-emerald-600 hover:bg-emerald-700 text-white transition-colors disabled:opacity-50"
                      >
                        <CheckCircle className="size-3.5" />
                        Concluir venda
                      </button>
                      <button
                        onClick={() => handleClickStatusAction('cancelled')}
                        disabled={updatingStatus}
                        className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium rounded-md bg-red-100 hover:bg-red-200 text-red-700 border border-red-200 transition-colors disabled:opacity-50"
                      >
                        <XCircle className="size-3.5" />
                        Cancelar venda
                      </button>
                    </div>
                  )}

                  {/* Vendedor com compra CONCLUÍDA: botão de ver detalhes */}
                  {isSeller && purchase.status === 'completed' && (
                    <div className="flex flex-wrap items-center gap-3">
                      <div className="flex items-center gap-1.5 text-xs text-emerald-700 font-medium">
                        <CheckCircle className="size-3.5" />
                        Venda concluída!
                      </div>
                      <button
                        onClick={() => navigate('/confirmacao-venda')}
                        className="ml-auto inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium rounded-md bg-[#871818] hover:bg-[#6b1010] text-white transition-colors"
                      >
                        <ExternalLink className="size-3.5" />
                        Ver detalhes da venda
                      </button>
                    </div>
                  )}

                  {/* Vendedor com compra CANCELADA */}
                  {isSeller && purchase.status === 'cancelled' && (
                    <div className="flex items-center gap-1.5 text-xs text-red-600 font-medium">
                      <XCircle className="size-3.5" />
                      Venda cancelada.
                    </div>
                  )}

                  {/* Comprador com compra CONCLUÍDA: botão de ver detalhes */}
                  {isBuyer && purchase.status === 'completed' && (
                    <div className="flex flex-wrap items-center gap-3">
                      <div className="flex items-center gap-1.5 text-xs text-emerald-700 font-medium">
                        <CheckCircle className="size-3.5" />
                        Compra confirmada pelo vendedor!
                      </div>
                      <button
                        onClick={() => navigate('/confirmacao-compra')}
                        className="ml-auto inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium rounded-md bg-[#871818] hover:bg-[#6b1010] text-white transition-colors"
                      >
                        <ExternalLink className="size-3.5" />
                        Ver detalhes da compra
                      </button>
                    </div>
                  )}

                  {/* Comprador com compra CANCELADA */}
                  {isBuyer && purchase.status === 'cancelled' && (
                    <div className="flex items-center gap-1.5 text-xs text-red-600 font-medium">
                      <XCircle className="size-3.5" />
                      Esta compra foi cancelada.
                    </div>
                  )}

                  {/* Comprador com compra PENDENTE: aguardando */}
                  {isBuyer && purchase.status === 'pending' && (
                    <div className="flex items-center gap-1.5 text-xs text-amber-700 font-medium">
                      <Clock className="size-3.5" />
                      Aguardando confirmação do vendedor...
                    </div>
                  )}
                </div>
              )}

              {/* ── Mensagens ─────────────────────────────────────────────── */}
              <div className="flex-1 p-4 overflow-y-auto bg-muted/10 space-y-3 h-0 min-h-0">
                {activeChatId && messages.length === 0 && (
                  <p className="text-center text-xs text-muted-foreground py-4">Carregando histórico...</p>
                )}
                {!activeChatId && (
                  <p className="text-center text-xs text-muted-foreground py-8 border border-dashed border-border rounded-lg bg-card max-w-sm mx-auto mt-4">
                    Envie uma mensagem abaixo para iniciar a conversa sobre este veículo.
                  </p>
                )}
                {messages.map((msg) => {
                  const isMe = msg.senderId === user?.id
                  return (
                    <div key={msg.id} className={`flex ${isMe ? 'justify-end' : 'justify-start'}`}>
                      <div className={`max-w-[75%] rounded-lg px-3 py-2 text-sm shadow-sm ${isMe ? 'bg-red-600 text-white rounded-br-none' : 'bg-secondary text-foreground rounded-bl-none'}`}>
                        <p className="leading-relaxed break-words">{msg.content}</p>
                        <span className={`text-[10px] block text-right mt-1 ${isMe ? 'text-red-100' : 'text-muted-foreground'}`}>
                          {new Date(msg.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                        </span>
                      </div>
                    </div>
                  )
                })}
                <div ref={messagesEndRef} />
              </div>

              {/* ── Input de mensagem ─────────────────────────────────────── */}
              <div className="p-3 border-t border-border bg-card shrink-0">
                <form onSubmit={handleSendMessage} className="flex gap-2">
                  <input
                    type="text"
                    value={newMessage}
                    onChange={(e) => setNewMessage(e.target.value)}
                    placeholder="Digite sua mensagem..."
                    className="flex-1 rounded-md border border-input bg-background px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-red-600/20 focus:border-red-600"
                    disabled={sending}
                  />
                  <button
                    type="submit"
                    disabled={sending || !newMessage.trim()}
                    className="bg-red-600 hover:bg-red-700 transition-colors text-white p-2 rounded-md disabled:opacity-50 flex items-center justify-center"
                  >
                    <Send className="size-4" />
                  </button>
                </form>
              </div>
            </>
          ) : (
            <div className="flex-1 flex flex-col items-center justify-center text-muted-foreground gap-2">
              <MessageSquare className="size-12 text-muted/60" />
              <p className="text-sm">Selecione uma conversa para começar a negociar.</p>
            </div>
          )}
        </div>
      </main>

      <Footer />

      {/* ── Modal de Confirmação do Vendedor ─────────────────────────────── */}
      {showConfirmModal && pendingAction && (
        <div className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4 backdrop-blur-sm">
          <div className="bg-card w-full max-w-sm rounded-xl shadow-2xl border border-border overflow-hidden animate-in fade-in zoom-in-95 duration-200">
            <div className="p-6">
              <div className={`flex items-center justify-center size-12 rounded-full mx-auto mb-4 ${pendingAction === 'completed' ? 'bg-emerald-100 text-emerald-600' : 'bg-red-100 text-red-600'}`}>
                {pendingAction === 'completed'
                  ? <CheckCircle className="size-6" />
                  : <AlertTriangle className="size-6" />}
              </div>
              <h3 className="text-lg font-bold text-foreground mb-2 text-center">
                {pendingAction === 'completed' ? 'Concluir Venda?' : 'Cancelar Venda?'}
              </h3>
              <p className="text-sm text-muted-foreground text-center">
                {pendingAction === 'completed'
                  ? 'Tem certeza que deseja concluir esta venda? O veículo será marcado como vendido e as demais propostas serão canceladas automaticamente.'
                  : 'Tem certeza que deseja cancelar esta venda? Esta ação não pode ser desfeita.'}
              </p>
            </div>
            <div className="bg-muted/40 p-4 flex justify-end gap-3 border-t border-border">
              <button
                onClick={() => { setShowConfirmModal(false); setPendingAction(null) }}
                className="px-4 py-2 text-sm font-medium text-foreground bg-background border border-border rounded-md hover:bg-muted transition-colors"
              >
                Voltar
              </button>
              <button
                onClick={handleConfirmStatus}
                disabled={updatingStatus}
                className={`px-4 py-2 text-sm font-medium text-white rounded-md transition-colors disabled:opacity-60 ${pendingAction === 'completed' ? 'bg-emerald-600 hover:bg-emerald-700' : 'bg-red-600 hover:bg-red-700'}`}
              >
                {updatingStatus ? 'Processando...' : 'Confirmar'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ── Toast de sucesso ──────────────────────────────────────────────── */}
      {successToast && (
        <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-50 bg-foreground text-background text-sm font-medium px-5 py-3 rounded-full shadow-xl animate-in fade-in slide-in-from-bottom-4 duration-300">
          {successToast}
        </div>
      )}
    </div>
  )
}