import { useEffect, useState, useRef } from 'react'
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
  type PurchaseStatus,
} from '../services/api'
import {
  Send,
  Car,
  MessageSquare,
  ArrowLeft,
  CheckCircle,
  XCircle,
  Loader2,
} from 'lucide-react'
import { formatCurrency } from '../services/utils'
import { io, Socket } from 'socket.io-client'

const SOCKET_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000'

// ─── Toast ─────────────────────────────────────────────────────────────────────

type ToastVariant = 'success' | 'error' | 'info'

interface ToastItem {
  id: number
  message: string
  variant: ToastVariant
  visible: boolean
}

const TOAST_ICONS: Record<ToastVariant, string> = {
  success: '✓',
  error: '✕',
  info: 'ℹ',
}

const TOAST_STYLES: Record<ToastVariant, string> = {
  success: 'bg-green-600 text-white shadow-green-900/30',
  error: 'bg-red-600 text-white shadow-red-900/30',
  info: 'bg-slate-700 text-white shadow-slate-900/30',
}

function ToastStack({ toasts }: { toasts: ToastItem[] }) {
  if (toasts.length === 0) return null
  return (
    <div
      aria-live="polite"
      className="fixed bottom-6 right-6 z-[9999] flex flex-col gap-3 pointer-events-none"
    >
      {toasts.map((t) => (
        <div
          key={t.id}
          role="status"
          style={{
            transition: 'opacity 300ms ease, transform 300ms ease',
            opacity: t.visible ? 1 : 0,
            transform: t.visible ? 'translateY(0)' : 'translateY(16px)',
          }}
          className={`flex items-start gap-3 px-4 py-3 rounded-xl shadow-xl max-w-sm pointer-events-auto ${
            TOAST_STYLES[t.variant]
          }`}
        >
          <span className="mt-0.5 text-base font-bold shrink-0 leading-none">
            {TOAST_ICONS[t.variant]}
          </span>
          <p className="text-sm leading-snug">{t.message}</p>
        </div>
      ))}
    </div>
  )
}

// ─── Status badge ──────────────────────────────────────────────────────────────

function PurchaseStatusBadge({ status }: { status: PurchaseStatus | undefined }) {
  if (!status || status === 'pending') return null

  const cfg = {
    completed: { label: 'Venda Concluída', cls: 'bg-green-100 text-green-700 border-green-300' },
    cancelled: { label: 'Venda Cancelada', cls: 'bg-red-100 text-red-700 border-red-300' },
  } as const

  const { label, cls } = cfg[status]
  return (
    <span className={`text-xs font-semibold px-2 py-0.5 rounded-full border ${cls}`}>
      {label}
    </span>
  )
}

// ─── Component ─────────────────────────────────────────────────────────────────

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

  // ── Estado dos botões de ação do vendedor ──────────────────────────────────
  const [actionLoading, setActionLoading] = useState<'completed' | 'cancelled' | null>(null)
  const [actionError, setActionError] = useState<string | null>(null)

  // ── Modal de confirmação ───────────────────────────────────────────────────
  const [showConfirmModal, setShowConfirmModal] = useState(false)
  const [pendingAction, setPendingAction] = useState<'completed' | 'cancelled' | null>(null)

  // ── Toast notifications ────────────────────────────────────────────────────
  const [toasts, setToasts] = useState<ToastItem[]>([])
  const toastCounterRef = useRef(0)

  const messagesEndRef = useRef<HTMLDivElement>(null)
  const socketRef = useRef<Socket | null>(null)

  // ── Autenticação ───────────────────────────────────────────────────────────
  useEffect(() => {
    if (!authApi.isLoggedIn()) {
      navigate('/login')
      return
    }
    authApi.getMe().then(setUser).catch(() => navigate('/login'))
  }, [])

  // ── Conexão WebSocket ──────────────────────────────────────────────────────
  useEffect(() => {
    socketRef.current = io(SOCKET_URL)

    // Listener: outro usuário atualizou o status da compra
    socketRef.current.on(
      'purchase_status_updated',
      (payload: { chatId: string; status: PurchaseStatus }) => {
        setChats((prev) =>
          prev.map((c) =>
            c.id === payload.chatId ? { ...c, purchaseStatus: payload.status } : c,
          ),
        )
      },
    )

    return () => {
      socketRef.current?.disconnect()
    }
  }, [])

  // ── Lista de chats ─────────────────────────────────────────────────────────
  useEffect(() => {
    messageApi
      .getMyChats()
      .then((res: ChatRoom[]) => {
        setChats(res)

        if (vehicleIdFromUrl) {
          const existingChat = res.find((c) => c.vehicleId === vehicleIdFromUrl)
          if (existingChat) {
            setActiveChatId(existingChat.id)
            setSearchParams({ id: existingChat.id })
          } else {
            vehicleApi
              .getVehicleById(vehicleIdFromUrl)
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

  // ── Histórico + listener de mensagens ─────────────────────────────────────
  useEffect(() => {
    if (!activeChatId) return

    setPendingVehicle(null)
    setActionError(null)

    messageApi
      .getChatHistory(activeChatId)
      .then((res: MessageData[]) => setMessages(res))
      .catch((err: any) => console.error(err))

    socketRef.current?.emit('join_chat', { chatId: activeChatId })
    socketRef.current?.on('receive_message', (incomingMessage: MessageData) => {
      if (incomingMessage.chatId === activeChatId) {
        setMessages((prev) => {
          if (prev.some((m) => m.id === incomingMessage.id)) return prev
          return [...prev, incomingMessage]
        })
      }
    })

    return () => {
      socketRef.current?.off('receive_message')
    }
  }, [activeChatId])

  // ── Scroll automático ──────────────────────────────────────────────────────
  useEffect(() => {
    if (messages.length > 0) {
      messagesEndRef.current?.scrollIntoView({ behavior: 'smooth', block: 'nearest' })
    }
  }, [messages])

  // ── Selecionar chat ────────────────────────────────────────────────────────
  const handleSelectChat = (id: string) => {
    setPendingVehicle(null)
    setActiveChatId(id)
    navigate(`/chat?id=${id}`, { replace: true })
  }

  // ── Enviar mensagem ────────────────────────────────────────────────────────
  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!newMessage.trim() || !user) return

    let currentVehicleId = vehicleIdFromUrl

    if (activeChatId) {
      const currentChat = chats.find((c) => c.id === activeChatId)
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
        if (prev.some((m) => m.id === sent.id)) return prev
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

  // ── Toast helper ───────────────────────────────────────────────────────────
  const showToast = (message: string, variant: ToastVariant = 'info', duration = 4000) => {
    const id = ++toastCounterRef.current
    // Adiciona toast invisível (para animação de entrada)
    setToasts((prev) => [...prev, { id, message, variant, visible: false }])
    // Torna visível no próximo frame
    setTimeout(() => {
      setToasts((prev) => prev.map((t) => (t.id === id ? { ...t, visible: true } : t)))
    }, 20)
    // Inicia saída
    setTimeout(() => {
      setToasts((prev) => prev.map((t) => (t.id === id ? { ...t, visible: false } : t)))
    }, duration)
    // Remove do DOM após animação
    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id))
    }, duration + 350)
  }

  // ── Ação do vendedor: abrir modal de confirmação ───────────────────────────
  const handleSellerAction = (action: 'completed' | 'cancelled') => {
    setPendingAction(action)
    setShowConfirmModal(true)
  }

  // ── Ação do vendedor: confirmar e chamar API ───────────────────────────────
  const handleConfirmAction = async () => {
    if (!activeChat?.purchaseId || !pendingAction) return

    const actionSnapshot = pendingAction
    setShowConfirmModal(false)
    setActionLoading(actionSnapshot)
    setActionError(null)
    setPendingAction(null)

    try {
      await purchaseApi.updatePurchaseStatus(activeChat.purchaseId, actionSnapshot)

      // 1. Atualização imediata do estado local
      setChats((prev) =>
        prev.map((c) =>
          c.id === activeChatId ? { ...c, purchaseStatus: actionSnapshot } : c,
        ),
      )

      // 2. Notifica o outro usuário via Socket.io (tempo real)
      socketRef.current?.emit('purchase_status_updated', {
        chatId: activeChatId,
        status: actionSnapshot,
      })

      // 3. Feedback visual de sucesso (Toast)
      if (actionSnapshot === 'completed') {
        showToast(
          'Venda concluída com sucesso! O status do veículo foi alterado para vendido.',
          'success',
        )
      } else {
        showToast('Intenção de compra cancelada. O comprador foi notificado.', 'info')
      }
    } catch (err: any) {
      const msg = err?.message || 'Erro ao atualizar status. Tente novamente.'
      setActionError(msg)
      showToast(msg, 'error')
    } finally {
      setActionLoading(null)
    }
  }

  // ── Dados derivados ────────────────────────────────────────────────────────
  const activeChat = chats.find((c) => c.id === activeChatId)
  const showChatWindow = activeChat || pendingVehicle

  const isSeller = !!(activeChat && user && activeChat.sellerId === user.id)
  const isBuyer = !!(activeChat && user && activeChat.buyerId === user.id)
  const isPurchasePending = activeChat?.purchaseStatus === 'pending'
  const hasPurchase = !!activeChat?.purchaseId
  // Botões visíveis apenas se: sou o vendedor, há compra vinculada e status é "pending"
  const showSellerActions = isSeller && hasPurchase && isPurchasePending
  // Badge visível para o comprador quando há compra pendente
  const showBuyerPendingBadge = isBuyer && hasPurchase && isPurchasePending
  const purchaseResolved =
    activeChat?.purchaseStatus === 'completed' || activeChat?.purchaseStatus === 'cancelled'

  // ── INTERFACE ──────────────────────────────────────────────────────────────
  return (
    <div className="min-h-screen bg-background flex flex-col font-sans">
      <Header user={user} />

      <main className="container mx-auto px-4 py-6 flex gap-4 max-w-7xl h-[800px] min-h-0 box-border">

        {/* Barra lateral de conversas */}
        <div
          className={`w-full md:w-80 border border-border rounded-xl flex flex-col bg-card overflow-hidden h-full max-h-full min-h-0 shrink-0 ${showChatWindow && 'hidden md:flex'}`}
        >
          <div className="p-4 border-b border-border bg-muted/50 shrink-0">
            <h2 className="font-bold text-lg flex items-center gap-2 text-foreground">
              <MessageSquare className="size-5 text-red-600" /> Minhas Conversas
            </h2>
          </div>

          <div className="flex-1 overflow-y-auto divide-y divide-border">
            {loadingChats ? (
              <p className="p-4 text-sm text-muted-foreground text-center animate-pulse">
                Carregando salas...
              </p>
            ) : chats.length === 0 && !pendingVehicle ? (
              <p className="p-4 text-sm text-muted-foreground text-center">
                Nenhum chat iniciado ainda.
              </p>
            ) : (
              <>
                {pendingVehicle && (
                  <div className="w-full p-4 text-left flex flex-col gap-1 bg-red-50/20 border-r-4 border-red-400 opacity-70 animate-pulse">
                    <span className="font-semibold text-sm text-foreground">
                      {pendingVehicle.owner?.fullName || 'Vendedor'}
                    </span>
                    <span className="text-xs text-muted-foreground truncate">
                      {pendingVehicle.title}
                    </span>
                  </div>
                )}

                {chats.map((room) => {
                  const isBuyer = room.buyerId === user?.id
                  const talkTo = isBuyer ? room.seller.fullName : room.buyer.fullName
                  return (
                    <button
                      key={room.id}
                      onClick={() => handleSelectChat(room.id)}
                      className={`w-full p-4 text-left flex flex-col gap-1 transition-colors hover:bg-muted/60 ${
                        room.id === activeChatId
                          ? 'bg-red-50/40 border-r-4 border-red-600'
                          : ''
                      }`}
                    >
                      <span className="font-semibold text-sm text-foreground">{talkTo}</span>
                      <span className="text-xs text-muted-foreground truncate">
                        {room.vehicle?.title || 'Veículo'}
                      </span>
                      {/* Mini badge de status na lista */}
                      {room.purchaseStatus && room.purchaseStatus !== 'pending' && (
                        <span
                          className={`text-[10px] font-medium mt-0.5 ${
                            room.purchaseStatus === 'completed'
                              ? 'text-green-600'
                              : 'text-red-500'
                          }`}
                        >
                          {room.purchaseStatus === 'completed' ? '✓ Concluída' : '✗ Cancelada'}
                        </span>
                      )}
                    </button>
                  )
                })}
              </>
            )}
          </div>
        </div>

        {/* Janela do chat */}
        <div
          className={`flex-1 border border-border rounded-xl flex flex-col bg-card overflow-hidden h-full max-h-full min-h-0 ${!showChatWindow && 'hidden md:flex'}`}
        >
          {showChatWindow ? (
            <>
              {/* ── Cabeçalho do chat ── */}
              <div className="p-4 border-b border-border bg-muted/30 flex items-center justify-between shrink-0 gap-3 flex-wrap">
                <div className="flex items-center gap-3 min-w-0">
                  <button
                    onClick={() => navigate('/chat')}
                    className="md:hidden p-1 text-muted-foreground hover:text-foreground shrink-0"
                  >
                    <ArrowLeft className="size-5" />
                  </button>
                  <div className="min-w-0">
                    <h3 className="font-bold text-sm text-foreground truncate">
                      {activeChat
                        ? activeChat.buyerId === user?.id
                          ? activeChat.seller.fullName
                          : activeChat.buyer.fullName
                        : pendingVehicle?.owner?.fullName || 'Vendedor'}
                    </h3>
                    {/* Badge de status da compra */}
                    {activeChat?.purchaseStatus && (
                      <PurchaseStatusBadge status={activeChat.purchaseStatus} />
                    )}
                  </div>
                </div>

                {/* ── Barra de ações do VENDEDOR ── */}
                {showSellerActions && (
                  <div className="flex items-center gap-2 shrink-0">
                    <button
                      id="btn-concluir-venda"
                      onClick={() => handleSellerAction('completed')}
                      disabled={!!actionLoading}
                      className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-lg bg-green-600 hover:bg-green-700 text-white transition-colors disabled:opacity-60 disabled:cursor-not-allowed"
                      title="Concluir a venda desta negociação"
                    >
                      {actionLoading === 'completed' ? (
                        <Loader2 className="size-3.5 animate-spin" />
                      ) : (
                        <CheckCircle className="size-3.5" />
                      )}
                      Concluir Venda
                    </button>

                    <button
                      id="btn-cancelar-venda"
                      onClick={() => handleSellerAction('cancelled')}
                      disabled={!!actionLoading}
                      className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-lg bg-red-600 hover:bg-red-700 text-white transition-colors disabled:opacity-60 disabled:cursor-not-allowed"
                      title="Cancelar esta negociação"
                    >
                      {actionLoading === 'cancelled' ? (
                        <Loader2 className="size-3.5 animate-spin" />
                      ) : (
                        <XCircle className="size-3.5" />
                      )}
                      Cancelar Venda
                    </button>
                  </div>
                )}

                {/* ── Badge de status para o COMPRADOR (compra pendente) ── */}
                {showBuyerPendingBadge && (
                  <div className="flex items-center gap-2 shrink-0">
                    <span className="flex items-center gap-1.5 text-xs font-semibold px-3 py-1.5 rounded-lg bg-amber-100 text-amber-700 border border-amber-300">
                      <Loader2 className="size-3.5 animate-spin" />
                      Aguardando vendedor
                    </span>
                  </div>
                )}

                {/* Badge e botão de detalhes quando compra já foi resolvida */}
                {purchaseResolved && (
                  <div className="flex items-center gap-3 shrink-0">
                    <PurchaseStatusBadge status={activeChat?.purchaseStatus} />
                    <button
                      onClick={() => navigate(isSeller ? '/confirmacao-venda' : '/confirmacao-compra')}
                      className="px-3 py-1.5 text-xs font-semibold rounded-lg bg-secondary text-foreground hover:bg-muted-foreground/20 transition-colors border border-border"
                    >
                      {isSeller ? 'Ver Detalhes da Venda' : 'Ver Detalhes da Compra'}
                    </button>
                  </div>
                )}
              </div>

              {/* Erro da ação */}
              {actionError && (
                <div className="mx-4 mt-2 px-3 py-2 text-xs text-red-700 bg-red-50 border border-red-200 rounded-md">
                  {actionError}
                </div>
              )}

              {/* ── Info do veículo ── */}
              {(activeChat || pendingVehicle) && (
                <div className="flex items-center gap-4 p-4 border-b border-border bg-muted/20 rounded-b-lg shadow-sm">
                  <Car className="size-6 text-primary" />
                  <div className="flex-1">
                    <h4 className="font-medium text-sm text-foreground">
                      {activeChat ? activeChat.vehicle?.title : pendingVehicle?.title}
                    </h4>
                    <p className="text-xs text-muted-foreground">
                      {formatCurrency(
                        activeChat
                          ? activeChat.vehicle?.price || 0
                          : pendingVehicle?.price || 0,
                      )}
                    </p>
                  </div>
                </div>
              )}

              {/* ── Mensagens ── */}
              <div className="flex-1 p-4 overflow-y-auto bg-muted/10 space-y-3 h-0 min-h-0">
                {activeChatId && messages.length === 0 && (
                  <p className="text-center text-xs text-muted-foreground py-4">
                    Carregando histórico...
                  </p>
                )}
                {!activeChatId && (
                  <p className="text-center text-xs text-muted-foreground py-8 border border-dashed border-border rounded-lg bg-card max-w-sm mx-auto mt-4">
                    Envie uma mensagem abaixo para iniciar a conversa sobre este veículo. Nenhuma
                    sala foi criada ainda.
                  </p>
                )}
                {messages.map((msg) => {
                  const isMe = msg.senderId === user?.id
                  return (
                    <div key={msg.id} className={`flex ${isMe ? 'justify-end' : 'justify-start'}`}>
                      <div
                        className={`max-w-[75%] rounded-lg px-3 py-2 text-sm shadow-sm ${
                          isMe
                            ? 'bg-red-600 text-white rounded-br-none'
                            : 'bg-secondary text-foreground rounded-bl-none'
                        }`}
                      >
                        <p className="leading-relaxed break-words">{msg.content}</p>
                        <span
                          className={`text-[10px] block text-right mt-1 ${
                            isMe ? 'text-red-100' : 'text-muted-foreground'
                          }`}
                        >
                          {new Date(msg.createdAt).toLocaleTimeString([], {
                            hour: '2-digit',
                            minute: '2-digit',
                          })}
                        </span>
                      </div>
                    </div>
                  )
                })}
                <div ref={messagesEndRef} />
              </div>

              {/* ── Entrada de texto ── */}
              <div className="p-3 border-t border-border bg-card shrink-0">
                <form onSubmit={handleSendMessage} className="flex gap-2">
                  <input
                    type="text"
                    value={newMessage}
                    onChange={(e) => setNewMessage(e.target.value)}
                    placeholder={
                      purchaseResolved
                        ? 'Esta negociação foi encerrada.'
                        : 'Digite sua mensagem...'
                    }
                    className="flex-1 rounded-md border border-input bg-background px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-red-600/20 focus:border-red-600 disabled:opacity-60"
                    disabled={sending || purchaseResolved}
                  />
                  <button
                    type="submit"
                    disabled={sending || !newMessage.trim() || purchaseResolved}
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

      {/* ── Modal de confirmação ── */}
      {showConfirmModal && pendingAction && (
        <div
          role="dialog"
          aria-modal="true"
          aria-labelledby="modal-title"
          className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4"
          onClick={(e) => {
            // Fecha ao clicar no backdrop
            if (e.target === e.currentTarget) {
              setShowConfirmModal(false)
              setPendingAction(null)
            }
          }}
        >
          <div className="bg-card w-full max-w-md rounded-2xl shadow-2xl border border-border overflow-hidden animate-in fade-in zoom-in-95 duration-200">
            {/* Faixa colorida de contexto */}
            <div
              className={`h-1.5 w-full ${
                pendingAction === 'completed' ? 'bg-green-500' : 'bg-red-500'
              }`}
            />

            <div className="p-6">
              {/* Ícone + Título */}
              <div className="flex items-center gap-3 mb-3">
                <span
                  className={`flex items-center justify-center size-10 rounded-full shrink-0 ${
                    pendingAction === 'completed'
                      ? 'bg-green-100 text-green-600'
                      : 'bg-red-100 text-red-600'
                  }`}
                >
                  {pendingAction === 'completed' ? (
                    <CheckCircle className="size-5" />
                  ) : (
                    <XCircle className="size-5" />
                  )}
                </span>
                <h3 id="modal-title" className="text-base font-bold text-foreground">
                  {pendingAction === 'completed'
                    ? 'Confirmar conclusão da venda'
                    : 'Confirmar cancelamento da venda'}
                </h3>
              </div>

              {/* Mensagem exata conforme requisito */}
              <p className="text-sm text-muted-foreground leading-relaxed">
                {pendingAction === 'completed'
                  ? 'Deseja confirmar a venda deste veículo? O status será atualizado para concluído e o comprador será notificado em tempo real.'
                  : 'Deseja realmente cancelar esta intenção de compra? Esta ação não pode ser desfeita e o comprador será notificado.'}
              </p>
            </div>

            <div className="bg-muted/40 px-6 py-4 flex justify-end gap-3 border-t border-border">
              <button
                id="btn-modal-voltar"
                onClick={() => {
                  setShowConfirmModal(false)
                  setPendingAction(null)
                }}
                className="px-4 py-2 text-sm font-medium text-foreground bg-background border border-border rounded-lg hover:bg-muted transition-colors"
              >
                Voltar
              </button>
              <button
                id="btn-confirmar-acao"
                onClick={handleConfirmAction}
                className={`px-5 py-2 text-sm font-semibold text-white rounded-lg transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 ${
                  pendingAction === 'completed'
                    ? 'bg-green-600 hover:bg-green-700 focus-visible:ring-green-500'
                    : 'bg-red-600 hover:bg-red-700 focus-visible:ring-red-500'
                }`}
              >
                {pendingAction === 'completed' ? 'Sim, concluir venda' : 'Sim, cancelar'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ── Toast stack ── */}
      <ToastStack toasts={toasts} />
    </div>
  )
}