import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  FlatList,
  ActivityIndicator,
  SafeAreaView
} from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import axios from 'axios';
import { useNavigation } from '@react-navigation/native';
import Constants from "expo-constants";

const AskAiButton = () => {
  const [question, setQuestion] = useState('');
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(false);
  const navigation = useNavigation();

  const expoUrl = Constants.manifest2?.extra?.expoGo?.debuggerHost;
  const ipAddress = expoUrl?.match(/^([\d.]+)/)?.[0] || "Not Available";

  const handleAsk = async () => {
    if (!question.trim()) return;
  
    const newMessages = [...messages, { type: 'user', text: question }];
    setMessages(newMessages);
    setQuestion('');
    setLoading(true);
    
    try {
      const res = await axios.post(`http://${ipAddress}:8000/api/auth/ask`, { question });
      const answer = res.data.answer || "⚠️ No response from the server.";
      setMessages([...newMessages, { type: 'bot', text: answer }]);
    } catch (err) {
      
  
      // If the status code is 404 and you still want the answer message
      if (err.response && err.response.status === 404 && err.response.data.answer) {
        setMessages([...newMessages, { type: 'bot', text: err.response.data.answer }]);
      } else {
        setMessages([
          ...newMessages,
          { type: 'bot', text: '⚠️ Something went wrong. Please try again.' }
        ]);
      }
    }
  
    setLoading(false);
  };

  const renderMessage = ({ item }) => {
    const isUser = item.type === 'user';
  
    return (
      <View
        style={[
          styles.message,
          isUser ? styles.userMessage : styles.botMessage
        ]}
      >
        <Text style={[styles.messageText, isUser ? styles.userText : styles.botText]}>
          {item.text}
        </Text>
      </View>
    );
  };
  
  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Icon name="arrow-back" size={24} color="#000" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Ask the Assistant</Text>
        <View style={{ width: 24 }} /> {/* Spacer for alignment */}
      </View>

      {/* Messages */}
      <FlatList
        data={messages}
        keyExtractor={(_, index) => index.toString()}
        renderItem={renderMessage}
        contentContainerStyle={{ padding: 16 }}
      />

      {/* Input */}
      <View style={styles.inputContainer}>
        <TextInput
          placeholder="Ask something about an event..."
          placeholderTextColor="#999"
          value={question}
          onChangeText={setQuestion}
          style={styles.input}
        />
        <TouchableOpacity style={styles.sendButton} onPress={handleAsk}>
          {loading ? (
            <ActivityIndicator color="#fff" />
          ) : (
            <Icon name="send" size={20} color="#fff" />
          )}
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
    messageText: {
        fontSize: 16,
      },
      userText: {
        color: '#fff',
      },
      botText: {
        color: '#000',
      },
  container: {
    flex: 1,
    backgroundColor: '#f6f7fb',
    marginTop:15,
    padding:5,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#ddd',
    backgroundColor: '#fff',
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#222',
  },
  message: {
    padding: 12,
    marginVertical: 4,
    borderRadius: 12,
    maxWidth: '85%',
  },
  userMessage: {
    backgroundColor: '#4a90e2',
    alignSelf: 'flex-end',
  },
  botMessage: {
    backgroundColor: '#e0e0e0',
    alignSelf: 'flex-start',
  },
  messageText: {
    color: '#fff',
    fontSize: 16,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 10,
    borderTopColor: '#ccc',
    borderTopWidth: 1,
    backgroundColor: '#fff',
  },
  input: {
    flex: 1,
    backgroundColor: '#f1f1f1',
    borderRadius: 25,
    paddingHorizontal: 16,
    paddingVertical: 10,
    fontSize: 16,
    color: '#000',
  },
  sendButton: {
    marginLeft: 8,
    backgroundColor: '#4a90e2',
    borderRadius: 25,
    padding: 10,
  },
});

export default AskAiButton;
