import { useEffect, useState, useRef } from 'react'
import { useSearchParams, useNavigate } from 'react-router'
import { Header } from '../components/header'
import { Footer } from '../components/footer'
import { messageApi, authApi, vehicleApi, type ChatRoom, type MessageData, type UserData, type Vehicle } from '../services/api'
import { Send, Car, MessageSquare, ArrowLeft } from 'lucide-react'
import { formatCurrency } from '../services/utils'
import { io, Socket } from 'socket.io-client'

const SOCKET_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000';

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

  const messagesEndRef = useRef<HTMLDivElement>(null)
  const socketRef = useRef<Socket | null>(null)

  // autenticação de usuário
  useEffect(() => {
    if (!authApi.isLoggedIn()) {
      navigate('/login')
      return
    }
    authApi.getMe().then(setUser).catch(() => navigate('/login'))
  }, [])


  //abre a conexão com websocket
  useEffect(() => {
    socketRef.current = io(SOCKET_URL)

    return () => {
      socketRef.current?.disconnect()
    }
  }, [])

  // carrega os chats 
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

  // puxa mensagens do banco de dados / espera mensagens novas
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

  // roda chat para baixo caso tenha mensagem nova, mas acho que o ideal seria ter uma notificação junto a um botão que puxa o chat para baixo.
  useEffect(() => {
    if (messages.length > 0) {
      messagesEndRef.current?.scrollIntoView({ behavior: 'smooth', block: 'nearest' })
    }
  }, [messages])

  // função para troca de chat no click
  const handleSelectChat = (id: string) => {
    setPendingVehicle(null)
    setActiveChatId(id)
    navigate(`/chat?id=${id}`, { replace: true })
  }

  //enviar mensagens
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
        chatId: activeChatId || undefined
      })

      setMessages((prev) => {
        if (prev.some(m => m.id === sent.id)) return prev;
        return [...prev, sent];
      });
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

  const activeChat = chats.find(c => c.id === activeChatId)
  const showChatWindow = activeChat || pendingVehicle

  // INTERFACE
  return (
    <div className="min-h-screen bg-background flex flex-col font-sans">
      <Header user={user} />

      <main className="container mx-auto px-4 py-6 flex gap-4 max-w-7xl h-[800px] min-h-0 box-border">

        {/* barra de conversas */}
        <div className={`w-full md:w-80 border border-border rounded-xl flex flex-col bg-card overflow-hidden h-full max-h-full min-h-0 shrink-0 ${showChatWindow && 'hidden md:flex'}`}>
          <div className="p-4 border-b border-border bg-muted/50 shrink-0">
            <h2 className="font-bold text-lg flex items-center gap-2 text-foreground">
              <MessageSquare className="size-5 text-red-600" /> Minhas Conversas
            </h2>
          </div>
          {/* Chats laterais */}
          <div className="flex-1 overflow-y-auto divide-y divide-border">
            {loadingChats ? (
              <p className="p-4 text-sm text-muted-foreground text-center animate-pulse">Carregando salas...</p>
            ) : chats.length === 0 && !pendingVehicle ? (
              <p className="p-4 text-sm text-muted-foreground text-center">Nenhum chat iniciado ainda.</p>
            ) : (
              <>
                {pendingVehicle && (
                  <div className="w-full p-4 text-left flex flex-col gap-1 bg-red-50/20 border-r-4 border-red-400 opacity-70 animate-pulse">
                    <span className="font-semibold text-sm text-foreground">{pendingVehicle.owner?.fullName || "Vendedor"}</span>
                    <span className="text-xs text-muted-foreground truncate">{pendingVehicle.title}</span>
                  </div>
                )}
                {/* chats ativos*/}
                {chats.map((room) => {
                  const isBuyer = room.buyerId === user?.id
                  const talkTo = isBuyer ? room.seller.fullName : room.buyer.fullName
                  return (
                    <button
                      key={room.id}
                      onClick={() => handleSelectChat(room.id)}
                      className={`w-full p-4 text-left flex flex-col gap-1 transition-colors hover:bg-muted/60 ${room.id === activeChatId ? 'bg-red-50/40 border-r-4 border-red-600' : ''}`}
                    >
                      <span className="font-semibold text-sm text-foreground">{talkTo}</span>
                      <span className="text-xs text-muted-foreground truncate">{room.vehicle?.title || "Veículo"}</span>
                    </button>
                  )
                })}
              </>
            )}
          </div>
        </div>
        {/* janela do chat*/}
        <div className={`flex-1 border border-border rounded-xl flex flex-col bg-card overflow-hidden h-full max-h-full min-h-0 ${!showChatWindow && 'hidden md:flex'}`}>
          {showChatWindow ? (
            <>
              <div className="p-4 border-b border-border bg-muted/30 flex items-center justify-between shrink-0">
                <div className="flex items-center gap-3">
                  <button onClick={() => navigate('/chat')} className="md:hidden p-1 text-muted-foreground hover:text-foreground">
                    <ArrowLeft className="size-5" />
                  </button>
                  <div>
                    <h3 className="font-bold text-sm text-foreground">
                      {activeChat
                        ? (activeChat.buyerId === user?.id ? activeChat.seller.fullName : activeChat.buyer.fullName)
                        : (pendingVehicle?.owner?.fullName || "Vendedor")}
                    </h3>
                    <p className="text-xs text-muted-foreground flex items-center gap-1 mt-0.5">
                      <Car className="size-3 text-red-600" />
                      {activeChat ? activeChat.vehicle?.title : pendingVehicle?.title} -
                      <span className="text-red-600 font-medium">
                        {formatCurrency(activeChat ? activeChat.vehicle?.price || 0 : pendingVehicle?.price || 0)}
                      </span>
                    </p>
                  </div>
                </div>
              </div>

              <div className="flex-1 p-4 overflow-y-auto bg-muted/10 space-y-3 h-0 min-h-0">
                {activeChatId && messages.length === 0 && (
                  <p className="text-center text-xs text-muted-foreground py-4">Carregando histórico...</p>
                )}
                {!activeChatId && (
                  <p className="text-center text-xs text-muted-foreground py-8 border border-dashed border-border rounded-lg bg-card max-w-sm mx-auto mt-4">
                    Envie uma mensagem abaixo para iniciar a conversa sobre este veículo. Nenhuma sala foi criada ainda.
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

              {/* entrada de texto do chat */}
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
    </div>
  )
}