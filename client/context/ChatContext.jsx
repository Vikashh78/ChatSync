import { createContext, useContext, useEffect, useState } from 'react'
import { AuthContext } from './AuthContext';
import toast from 'react-hot-toast';

export const ChatContext = createContext();

export const ChatProvider = ({children}) => {

    const [message, setMessage] = useState([])
    const [users, setUsers] = useState([])
    const [selectedUser, setSelectedUser] = useState(null)
    const [unseenMessage, setUnseenMessage] = useState({})

    const {socket, axios} = useContext(AuthContext)

    // Function to get all users for Sidebar
    const getUsers = async () => {
        try {
            //making API call
            const { data } = await axios.get("/api/messages/users")
            if(data.success) {
                setUsers(data.users)
                setUnseenMessage(data.unseenMessage || {})
            }
        } catch (error) {
            toast.error(error.message)
        }
    }

    // Function to get messages for selected user
    const getMessage = async (userId) => {
        try {
            const { data } = await axios.get(`/api/messages/${userId}`)
            if(data.success) {
                console.log("Messages API response:", data);
                setMessage(data.message || [])
            }
        } catch (error) {
            toast.error(error.message)
        }
    }

    // Function to send message to selected user
    const sendMessage = async (messageData) => {
        try {
            const {data} = await axios.post(`/api/messages/send/${selectedUser._id}`, messageData);

            if(data.success) {
                setMessage((prevMessage) => [...prevMessage, data.newMessage])
            } else {
                toast.error(data.message)
            }

        } catch (error) {
            toast.error(error.message)
        }
    }

    // Function to subscribe to message for selected user
    const subscribeToMessage = async () => {
        if(!socket) return;

        socket.on("newMessage", async (newMessage) => {
            if(selectedUser && newMessage.senderId === selectedUser._id) {
                newMessage.seen = true; //as chat is open for that user
                setMessage((prevMessages) => [...prevMessages, newMessage])
                await axios.put(`/api/messages/mark/${newMessage._id}`);

            } else {
                setUnseenMessage((prev) => ({
                    ...(prev || {}), 
                    [newMessage?.senderId] : 
                    (prev?.[newMessage?.senderId] || 0) + 1 
                }))
            }
        })
    }

    // Function to unsubscribe from messages
    const unsubscribeFromMessages = () => {
        if(socket) {
            socket.off("newMessage");
        }
    }


    // Fetch messages when user is selected
    useEffect(() => {
        if (!selectedUser) return;
        getMessage(selectedUser._id);
    }, [selectedUser]);


    useEffect(() => {
        subscribeToMessage();
        return () => unsubscribeFromMessages();

    }, [socket, selectedUser]);



    const value = {
        message,
        users,
        selectedUser,
        getUsers,
        getMessage,
        setMessage,
        sendMessage,
        setSelectedUser,
        unseenMessage,
        setUnseenMessage,
    }

    return (
        <ChatContext.Provider value={value}>
            {children}
        </ChatContext.Provider>
    )
}