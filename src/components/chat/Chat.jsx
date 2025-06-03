"use client"

import { useState, useEffect, useRef, useCallback } from "react"
import { Send, Camera, Search, Heart, Bell, X } from "lucide-react"
import { Avatar, Button, Input } from "@material-tailwind/react"
import SendBird from "sendbird"
import ProductCatalog from "./ProductCatalog"
import ChatProductCatalog from "./ChatProductCatalog"

// Initialize SendBird
const sb = new SendBird({ appId: "F7152889-3BAC-41FC-AE1B-BA64DCCABD28" })

const Chat = () => {
  const [participants, setParticipants] = useState([])
  const [messages, setMessages] = useState([])
  const [newMessage, setNewMessage] = useState("")
  const [selectedChat, setSelectedChat] = useState(null)
  const [searchQuery, setSearchQuery] = useState("")
  const messagesEndRef = useRef(null)
  const [sbChannel, setSbChannel] = useState(null)
  const [userChannels, setUserChannels] = useState([])
  const [isLoadingMore, setIsLoadingMore] = useState(false)
  const [hasMore, setHasMore] = useState(true)
  const messageListRef = useRef(null)
  const messageListQuery = useRef(null)
  const [newMessageAdded, setNewMessageAdded] = useState(false)
  const [selectedImage, setSelectedImage] = useState(null)
  const [imagePreview, setImagePreview] = useState(null)
  const fileInputRef = useRef(null)

  // Add this function to fetch all channels
  const loadUserChannels = () => {
    const channelListQuery = sb.GroupChannel.createMyGroupChannelListQuery()
    channelListQuery.includeEmpty = true
    channelListQuery.limit = 100
    channelListQuery.isDistinct = true
    channelListQuery.order = "latest_last_message" // Sort by latest message

    channelListQuery.next((channels, error) => {
      if (error) {
        console.error("Error fetching channels:", error)
        return
      }

      // Map channels to include last message and other details
      const processedChannels = channels.map((channel) => {
        const otherMember = channel.members.find((member) => member.userId !== sb.currentUser.userId)
        return {
          url: channel.url,
          name: otherMember?.nickname || otherMember?.userId || "Unknown User",
          lastMessage: channel.lastMessage?.message || "",
          unreadMessageCount: channel.unreadMessageCount,
          members: channel.members,
          channel: channel, // Store the full channel object
        }
      })

      setUserChannels(processedChannels)

      // If there's a selectedChat, load its messages
      if (selectedChat) {
        const currentChannel = channels.find((channel) =>
          channel.members.some((member) => member.userId === selectedChat),
        )
        if (currentChannel) {
          setSbChannel(currentChannel)
          loadChannelMessages(currentChannel)
        }
      }
    })
  }

  // Add this function to load channel messages
  const loadChannelMessages = async (channel, isInitial = true) => {
    if (isInitial) {
      messageListQuery.current = channel.createPreviousMessageListQuery()
      messageListQuery.current.limit = 20
      messageListQuery.current.reverse = true
    }

    if (!messageListQuery.current || !messageListQuery.current.hasMore) {
      setHasMore(false)
      return
    }

    setIsLoadingMore(true)

    try {
      messageListQuery.current.load((messages, error) => {
        if (error) {
          console.error("Error fetching messages:", error)
          return
        }

        const orderedMessages = messages
          .sort((a, b) => a.createdAt - b.createdAt)
          .map((msg) => {
            // Check if this is a product message
            let productData = null
            if (msg.customType === "product" && msg.data) {
              try {
                productData = JSON.parse(msg.data)
              } catch (e) {
                console.error("Error parsing product data:", e)
              }
            }

            return {
              id: msg.messageId,
              text: msg.message,
              senderId: msg.sender.userId,
              timestamp: msg.createdAt,
              senderName: msg.sender.nickname || msg.sender.userId,
              type: msg.messageType === 'file' ? 'image' : msg.customType === 'catalog' ? 'catalog' : 'text',
              url: msg.url,
              data: msg.data,
            }
          })

        setMessages((prev) => {
          if (isInitial) {
            // Only scroll to bottom on initial load
            setTimeout(() => {
              if (messagesEndRef.current) {
                messagesEndRef.current.scrollIntoView({ behavior: "auto" })
              }
            }, 0)
            return orderedMessages
          }
          // Don't scroll when loading previous messages
          return [...orderedMessages, ...prev]
        })

        setHasMore(messageListQuery.current.hasMore)
        setIsLoadingMore(false)
      })
    } catch (error) {
      console.error("Error loading messages:", error)
      setIsLoadingMore(false)
    }
  }

  // Load channels when component mounts and when Sendbird connects
  useEffect(() => {
    const connectToSendbird = async () => {
      try {
        await sb.connect("ADMIN_USER_ID") // Connect as admin
        loadUserChannels() // Load channels after connection

        const userQuery = sb.createApplicationUserListQuery()
        const users = await userQuery.next()
        const formattedUsers = users.map((user) => ({
          id: user.userId,
          name: user.nickname || user.userId,
          role: user.metaData?.role || "User",
          avatar: user.profileUrl || `https://api.dicebear.com/6.x/initials/svg?seed=${user.nickname}`,
          status: user.connectionStatus || "offline",
          email: user.metaData?.email,
        }))
        setParticipants(formattedUsers)
      } catch (error) {
        console.error("Error connecting to Sendbird:", error)
      }
    }
    connectToSendbird()

    // Cleanup function
    return () => {
      if (sb) {
        sb.disconnect()
      }
    }
  }, [])

  // Update channel loading when selecting a chat
  useEffect(() => {
    if (!selectedChat || !sb.currentUser) return

    const setupChannel = async () => {
      try {
        const existingChannel = userChannels.find((channel) =>
          channel.members.some((member) => member.userId === selectedChat),
        )

        if (existingChannel) {
          setSbChannel(existingChannel.channel)
          await loadChannelMessages(existingChannel.channel, true)

          const channelHandler = new sb.ChannelHandler()
          channelHandler.onMessageReceived = (channel, message) => {
            // Check if this is a product message
            let productData = null
            if (message.customType === "product" && message.data) {
              try {
                productData = JSON.parse(message.data)
              } catch (e) {
                console.error("Error parsing product data:", e)
              }
            }

            setMessages((prev) => [
              ...prev,
              {
                id: message.messageId,
                text: message.message,
                senderId: message.sender.userId,
                timestamp: message.createdAt,
                senderName: message.sender.nickname || message.sender.userId,
                type: message.messageType === 'file' ? 'image' : message.customType === 'catalog' ? 'catalog' : 'text',
                url: message.url,
                data: message.data
              },
            ])
            setNewMessageAdded(true)
          }

          sb.addChannelHandler(`channel_${existingChannel.channel.url}`, channelHandler)
        } else {
          // Create new channel if it doesn't exist
          const params = {
            isDistinct: true,
            userIds: [selectedChat],
            isPublic: false,
          }

          sb.GroupChannel.createChannelWithUserIds(params.userIds, params.isDistinct, (channel, error) => {
            if (error) {
              console.error("Error creating channel:", error)
              return
            }
            setSbChannel(channel)
            loadUserChannels() // Reload channels after creating new one
          })
        }
      } catch (error) {
        console.error("Error setting up Sendbird channel:", error)
      }
    }

    setupChannel()

    return () => {
      if (sbChannel) {
        sb.removeChannelHandler(`channel_${sbChannel.url}`)
      }
    }
  }, [selectedChat])

  // Handle sending a product in chat
  const handleSendCatalog = async (product) => {
    // Determine the correct redirect URL based on product type
    let productUrl;
    if (product.is_regular_yacht) {
      productUrl = `${import.meta.env.VITE_CATALOG_REGULAR_YACHT_REDIRECT_URL}${product.id}`;
    } else if (product.is_f1_yacht) {
      productUrl = `${import.meta.env.VITE_CATALOG_F1_YATCH_REDIRECT_URL}${product.id}`;
    } else if (product.is_experience) {
      productUrl = `${import.meta.env.VITE_CATALOG_EXPERIENCE_REDIRECT_URL}${product.id}`;
    }
    
    // console.log('product=====', product);
    
    if (sbChannel) {
      const params = new sb.UserMessageParams();
      params.message = 'Product Catalog'; // Fallback message
      params.customType = 'catalog';
      params.messageType = 'catalog';
      params.data = JSON.stringify({
        productId: product.id,
        name: product.name,
        price: product.price,
        imageUrl: product.image,
        productUrl: productUrl,
        is_regular_yacht: product.is_regular_yacht,
        is_f1_yacht: product.is_f1_yacht,
        is_experience: product.is_experience
      });

      sbChannel.sendUserMessage(params, (message, error) => {
        if (error) {
          console.error('Error sending catalog message:', error);
          return;

        }

        setMessages(prev => [...prev, {
          id: message.messageId,
          text: message.message,
          senderId: message.sender.userId,
          timestamp: message.createdAt,
          senderName: message.sender.nickname || message.sender.userId,
          type: 'catalog',
          data: JSON.stringify({
            productId: product.id,
            name: product.name,
            price: product.price,
            imageUrl: product.image,
            productUrl: productUrl,
            is_regular_yacht: product.is_regular_yacht,
            is_f1_yacht: product.is_f1_yacht,
            is_experience: product.is_experience
          })
        }]);
      });
    }
  };

  // Replace Firebase send message with Sendbird
  const handleSendMessage = async (e) => {
    e.preventDefault()

    if (selectedImage && sbChannel) {
      const params = new sb.FileMessageParams()
      params.file = selectedImage
      params.fileName = selectedImage.name
      params.mimeType = selectedImage.type

      sbChannel.sendFileMessage(params, (message, error) => {
        if (error) {
          console.error("Error sending image:", error)
          return
        }

        // Use the correct URL format from the message object
        const fileUrl = message.url.startsWith("http") ? message.url : `https://file-ap-8.sendbird.com${message.url}`

        setMessages((prev) => [
          ...prev,
          {
            id: message.messageId,
            text: "",
            senderId: message.sender.userId,
            timestamp: message.createdAt,
            senderName: message.sender.nickname || message.sender.userId,
            type: "image",
            url: fileUrl, // Use the corrected URL
          },
        ])

        // Clear image preview and selected image
        setImagePreview(null)
        setSelectedImage(null)
        URL.revokeObjectURL(imagePreview)
      })
    } else if (newMessage.trim() && sbChannel) {
      try {
        const params = new sb.UserMessageParams()
        params.message = newMessage
        params.customType = "text"

        sbChannel.sendUserMessage(params, (message, error) => {
          if (error) {
            console.error("Error sending message:", error)
            return
          }

          setMessages((prev) => [
            ...prev,
            {
              id: message.messageId,
              text: message.message,
              senderId: message.sender.userId,
              timestamp: message.createdAt,
              senderName: message.sender.nickname || message.sender.userId,
              type: "text",
            },
          ])

          setNewMessage("")
          setNewMessageAdded(true)
        })
      } catch (error) {
        console.error("Error in message handling:", error)
      }
    }
  }

  // Replace Firebase new chat with Sendbird
  const startNewChat = async () => {
    try {
      const params = new sb.GroupChannelParams()
      params.isDistinct = false
      const channel = await sb.GroupChannel.createChannel(params)
      setSbChannel(channel)
      setSelectedChat(channel.url)
      setMessages([])
    } catch (error) {
      console.error("Error starting new chat:", error)
    }
  }

  const scrollToBottom = (behavior = "smooth") => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior })
    }
  }

  // useEffect(() => {
  //   scrollToBottom();
  // }, [messages]);

  const filteredParticipants = participants.filter((participant) =>
    participant.name.toLowerCase().includes(searchQuery.toLowerCase()),
  )

  const getSelectedParticipant = () => {
    return participants.find((p) => p.id === selectedChat)
  }

  // Add scroll handler for infinite scroll
  const handleScroll = useCallback(
    (e) => {
      const element = e.target
      if (isLoadingMore || !hasMore) return

      // Load more when user scrolls near the top
      if (element.scrollTop <= element.clientHeight * 0.2) {
        loadChannelMessages(sbChannel, false)
      }
    },
    [isLoadingMore, hasMore, sbChannel],
  )

  // Add this useEffect to handle scrolling
  useEffect(() => {
    if (newMessageAdded) {
      scrollToBottom()
      setNewMessageAdded(false)
    }
  }, [messages, newMessageAdded])

  // Update file selection handler to show preview
  const handleFileSelect = (e) => {
    const file = e.target.files?.[0]
    if (!file) return

    // Check if file is an image
    if (!file.type.startsWith("image/")) {
      alert("Please select an image file")
      return
    }

    // Create preview URL
    const previewUrl = URL.createObjectURL(file)
    setImagePreview(previewUrl)
    setSelectedImage(file)
  }

  // Add function to handle image send
  const handleSendImage = async () => {
    if (!selectedImage || !sbChannel) return

    try {
      const fileMessageParams = new sb.FileMessageParams()
      fileMessageParams.file = selectedImage
      fileMessageParams.fileName = selectedImage.name
      fileMessageParams.fileSize = selectedImage.size
      fileMessageParams.mimeType = selectedImage.type

      sbChannel.sendFileMessage(fileMessageParams, (fileMessage, error) => {
        if (error) {
          console.error("Error sending image:", error)
          return
        }

        setMessages((prev) => [
          ...prev,
          {
            id: fileMessage.messageId,
            text: fileMessage.message || "",
            senderId: fileMessage.sender.userId,
            timestamp: fileMessage.createdAt,
            senderName: fileMessage.sender.nickname || fileMessage.sender.userId,
            type: "image",
            url: fileMessage.url,
          },
        ])

        // Clear preview and selected image
        setImagePreview(null)
        setSelectedImage(null)
      })
    } catch (error) {
      console.error("Error handling file:", error)
    }
  }

  return (
    <section className="lg:h-[calc(100vh-150px)] container mx-auto border-2 my-[2px] border-gray-200 rounded-2xl flex flex-col lg:flex-row">
      {/* Aside for Participants */}
      <aside className="w-full lg:w-1/4 border-b lg:border-r-2 border-gray-200 overflow-y-auto">
        <div className="p-3">
          <div className="flex items-center mb-2 justify-between">
            <h2 className="text-xl font-bold">Messages</h2>
            {/* <Plus className="h-6 w-6 cursor-pointer hover:text-[#BEA355] transition-colors" /> */}
          </div>
          <div className="p-2 space-y-4">
            <div className="relative">
              <Search className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
              <Input
                type="search"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search conversations"
                className="pl-10 py-2 px-2 border border-gray-200 rounded-lg outline-none focus:ring-2 focus:ring-[#BEA355] w-full"
              />
            </div>
            {/* <Button
              onClick={startNewChat}
              className="w-full h-10 capitalize flex items-center justify-center rounded-lg text-white transition duration-500 ease-in-out bg-[#BEA355] hover:bg-[#9a8544] shadow-none"
            >
              <Plus className="w-5 h-5 mr-2" />
              Start a new chat
            </Button> */}
          </div>
          <div className="space-y-2">
            {filteredParticipants.map((participant) => {
              console.log("participant",participant)
              const userChannel = userChannels.find((ch) =>
                ch.members.some((member) => member.userId === participant.id),
              )

              return (
                <div
                  key={participant.id}
                  onClick={() => setSelectedChat(participant.id)}
                  className={`flex flex-wrap items-center mb-2 border-b-2 border-gray-200 p-2 hover:bg-gray-100 transition-all duration-300 ease-in-out cursor-pointer hover:rounded-lg ${selectedChat === participant.id ? "bg-gray-100" : ""}`}
                >
                  <div className="relative">
                    <Avatar src={participant.avatar} alt={participant.name} className="h-10 w-10" />
                    <span
                      className={`absolute bottom-0 right-0 h-3 w-3 rounded-full border-2 border-white ${participant.status === "online" ? "bg-green-500" : "bg-gray-400"}`}
                    />
                  </div>
                  <div className="ml-3 flex-1 min-w-[150px]">
                    {" "}
                    {/* Add a min-width to ensure it doesn't collapse too much */}
                    <p className="font-semibold">{participant.name}</p>
                    {userChannel && (
                      <p className="text-sm text-gray-600 truncate">{userChannel.lastMessage || "No messages yet"}</p>
                    )}
                  </div>
                  {/* {userChannel && userChannel.unreadMessageCount > 0 && (
                  <div className="bg-[#BEA355] text-white rounded-full px-2 py-1 text-xs">
                    {userChannel.unreadMessageCount}
                  </div>
                )} */}
                </div>
              )
            })}
          </div>
        </div>
      </aside>

      {/* Chat Section */}
      <div className="flex-1 flex flex-col">
        {selectedChat ? (
          <>
            {/* Chat Header */}
            <div className="flex items-center justify-between p-4 border-b">
              <div className="flex items-center space-x-4">
                <div className="relative">
                  <Avatar
                    src={getSelectedParticipant()?.avatar}
                    alt={getSelectedParticipant()?.name}
                    className="h-10 w-10"
                  />
                  <span
                    className={`absolute bottom-0 right-0 h-3 w-3 rounded-full border-2 border-white ${getSelectedParticipant()?.status === "online" ? "bg-green-500" : "bg-gray-400"
                      }`}
                  />
                </div>
                <div>
                  <h3 className="font-semibold">{getSelectedParticipant()?.name}</h3>
                  <p className="text-sm text-gray-600">{getSelectedParticipant()?.status}</p>
                </div>
              </div>
              <div className="flex space-x-2">
                <Button variant="text" className="p-2">
                  <Search className="h-5 w-5" />
                </Button>
                <Button variant="text" className="p-2">
                  <Heart className="h-5 w-5" />
                </Button>
                <Button variant="text" className="p-2">
                  <Bell className="h-5 w-5" />
                </Button>
              </div>
            </div>

            {/* Messages */}
            <div
              className="flex-1 overflow-y-auto p-4 space-y-4"
              ref={messageListRef}
              onScroll={handleScroll}
              style={{ display: "flex", flexDirection: "column" }}
            >
              {isLoadingMore && (
                <div className="text-center py-2">
                  <span className="text-gray-500">Loading more messages...</span>
                </div>
              )}
              <div style={{ marginTop: 'auto' }}>
                {messages.map((message) => (
                  console.log(message),
                  <div
                    key={message.id}
                    className={`flex ${message.senderId === sb.currentUser.userId ? 'justify-end' : 'justify-start'} mb-4`}
                  >
                    <div className={`max-w-[70%] ${message.senderId === sb.currentUser.userId
                      ? 'bg-[#BEA355] text-white rounded-l-lg rounded-br-lg'
                      : 'bg-gray-100 text-gray-800 rounded-r-lg rounded-bl-lg'
                      } p-3 shadow-sm`}
                    >
                      {(() => {
                        if (message.type === 'image') {
                          return (
                            <img
                              src={message.url}
                              alt="Message"
                              className="max-h-60 rounded-lg"
                            />
                          );
                        } else if (message.type == 'catalog') {
                          return (
                            <ChatProductCatalog product={message?.data?.length > 0 ? JSON.parse(message?.data) : {}} />
                          );
                        } else {
                          console.log("message.type", message.type)
                          return <p className="text-sm">{message.text} </p>;
                        }
                      })()}
                      <span className="text-xs opacity-70 mt-1 block">
                        {
                          new Date(message.timestamp).toLocaleTimeString([], {
                            hour: '2-digit',
                            minute: '2-digit'
                          })}
                      </span>
                    </div>
                  </div>
                ))}
                <div ref={messagesEndRef} />
              </div>
            </div>

            {/* Input Area */}
            <div className="border-t p-4">
              {imagePreview && (
                <div className="mb-4 relative">
                  <img src={imagePreview || "/placeholder.svg"} alt="Preview" className="max-h-60 rounded-lg" />
                  <button
                    onClick={() => {
                      setImagePreview(null)
                      setSelectedImage(null)
                    }}
                    className="absolute top-2 right-2 bg-red-500 text-white rounded-full p-1"
                  >
                    <X className="h-4 w-4" />
                  </button>
                </div>
              )}
              <form onSubmit={handleSendMessage} className="flex items-center gap-2">
                <input type="file" ref={fileInputRef} className="hidden" accept="image/*" onChange={handleFileSelect} />
                <Button variant="text" className="p-2" type="button" onClick={() => fileInputRef.current?.click()}>
                  <Camera className="h-6 w-6" />
                </Button>

                {/* Product Catalog Button */}
                <ProductCatalog onSelectProduct={handleSendCatalog} />

                <input
                  type="text"
                  value={newMessage}
                  onChange={(e) => setNewMessage(e.target.value)}
                  placeholder="Type your message..."
                  className="flex-1 rounded-full border px-4 py-2 focus:outline-none focus:border-[#BEA355]"
                />
                <Button
                  type="submit"
                  onClick={(e) => {
                    e.preventDefault()
                    if (selectedImage) {
                      handleSendImage()
                    } else if (newMessage.trim()) {
                      handleSendMessage(e)
                    }
                  }}
                  className="bg-[#BEA355] text-white rounded-full p-2"
                >
                  <Send className="h-6 w-6" />
                </Button>
              </form>
            </div>
          </>
        ) : (
          <div className="flex-1 flex items-center justify-center">
            <div className="text-center">
              <h3 className="text-xl font-semibold text-gray-700 mb-2">Welcome to Messages</h3>
              <p className="text-gray-500">Select a conversation or start a new one</p>
            </div>
          </div>
        )}
      </div>
    </section>
  )
}

export default Chat
