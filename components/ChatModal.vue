<script setup lang="ts">
import { ref, computed, onMounted, onUnmounted, watch } from 'vue';
import { useCountriesStore } from '~/stores/countries';
import { useWebSocketStore } from '~/stores/websocket';
import type {Message, User} from "~/types/types";

const props = defineProps<{
  user: User;
}>();

const countriesStore = useCountriesStore();
const webSocketStore = useWebSocketStore();
const messages = ref<Message[]>(webSocketStore.chatMessages);
const newMessage = ref('');
const isMinimized = ref(false);
const showVisitedCountries = ref(false);
const showCommonCountries = ref(false);

const connectedUser = computed(() => webSocketStore.username);

onMounted(() => {
  webSocketStore.sendMessage({
    type: 'getCountries',
    username: props.user.username,
  });

  const stopWatcher = watch(() => webSocketStore.chatMessages, (newMessages) => {
    nextTick(() => {
      const chatMessages = document.querySelector('.chat-messages');
      if (chatMessages) {
        chatMessages.scrollTop = chatMessages.scrollHeight;
      }
    });
  }, { deep: true });

  onUnmounted(() => {
    stopWatcher();
  });

  nextTick(() => {
    const chatMessages = document.querySelector('.chat-messages');
    if (chatMessages) {
      chatMessages.scrollTop = chatMessages.scrollHeight;
    }
  });
});

const sendMessage = () => {
  if (!newMessage.value.trim()) return;
  webSocketStore.sendChatMessage(props.user.username, newMessage.value.trim());
  newMessage.value = '';
  nextTick(() => {
    const chatMessages = document.querySelector('.chat-messages');
    if (chatMessages) {
      chatMessages.scrollTop = chatMessages.scrollHeight;
    }
  });
};

const toggleMinimize = () => {
  isMinimized.value = !isMinimized.value;
  if (showVisitedCountries.value || showCommonCountries.value) {
    showVisitedCountries.value = false;
    showCommonCountries.value = false;
  }
};

const toggleVisitedCountries = () => {
  showVisitedCountries.value = !showVisitedCountries.value;
  if (showVisitedCountries.value) {
    showCommonCountries.value = false;
  }
};

const toggleCommonCountries = () => {
  showCommonCountries.value = !showCommonCountries.value;
  if (showCommonCountries.value) {
    showVisitedCountries.value = false;
  }
};

const formatTime = (timestamp: any) => {
  const date = new Date(timestamp);
  return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
};

const theirVisitedCountries = computed(() => props.user.visitedCountries || []);

const myVisitedCountries = computed(() => countriesStore.countries || []);

const commonVisitedCountries = computed(() =>
    myVisitedCountries.value.filter(country =>
        theirVisitedCountries.value.includes(country)
    )
);

function stringToColor(username: string | undefined) {
  if (!username) {
    console.log('Username is undefined in ChatModal component');
    return '#cccccc';
  }

  let hash = 0;
  for (let i = 0; i < username.length; i++) {
    hash = username.charCodeAt(i) + ((hash << 5) - hash);
  }
  let colour = '#';
  for (let i = 0; i < 3; i++) {
    let value = (hash >> (i * 16)) & 0xff;
    colour += ('00' + value.toString(16)).substr(-2);
  }
  return colour;
}

function stringToColorOpacity30(username: string | undefined) {
  const baseColor = stringToColor(username);
  return `${baseColor}30`;
}
</script>

<template>
  <div
      class="chat-modal"
      :class="{ 'minimized': isMinimized }"
      :style="{
      borderTop: `3px solid ${stringToColor(props.user.username)}`,
      height: isMinimized ? 'auto' : '300px'
    }"
  >
    <div
        class="chat-header"
        :style="{
        backgroundColor: stringToColorOpacity30(props.user.username),
        borderBottom: `1px solid ${stringToColor(props.user.username)}30`
      }"
    >
      <div class="user-info">
        <div
            class="avatar"
            :style="{ backgroundColor: stringToColor(props.user.username) }"
        >
          {{ props.user.username.charAt(0).toUpperCase() }}
        </div>
        <div class="username">{{ props.user.username }}</div>
      </div>

      <div class="actions">
        <button class="action-button" @click="toggleVisitedCountries">
          <Icon name="mdi:map-marker" />
        </button>
        <button class="action-button" @click="toggleCommonCountries">
          <Icon name="mdi:handshake" />
        </button>
        <button class="action-button" @click="toggleMinimize">
          <Icon :name="isMinimized ? 'mdi:chevron-up' : 'mdi:chevron-down'" />
        </button>
      </div>
    </div>
    <div class="chat-content" v-if="!isMinimized">
      <div v-if="showVisitedCountries" class="countries-panel">
        <h3 class="panel-title">Pays visités par {{ props.user.username }}</h3>
        <div class="countries-list">
          <div v-if="theirVisitedCountries.length === 0" class="empty-state">
            Aucun pays visité
          </div>
          <div
              v-for="country in theirVisitedCountries"
              :key="country"
              class="country-item"
          >
            {{ country }}
          </div>
        </div>
      </div>
      <div v-else-if="showCommonCountries" class="countries-panel">
        <h3 class="panel-title">Pays en commun</h3>
        <div class="countries-list">
          <div v-if="commonVisitedCountries.length === 0" class="empty-state">
            Aucun pays en commun
          </div>
          <div
              v-for="country in commonVisitedCountries"
              :key="country"
              class="country-item common"
              :style="{ backgroundColor: stringToColorOpacity30(props.user.username) }"
          >
            {{ country }}
          </div>
        </div>
      </div>
      <div v-else class="chat-messages">
        <div v-if="messages.length === 0" class="empty-chat">
          Commencez à discuter avec {{ props.user.username }}
        </div>
        <div v-for="(message, index) in messages"
             :key="index"
             class="message"
             :class="{
            'own-message': message.sender === connectedUser,
            'their-message': message.sender === props.user.username
          }"
        >
          <div
              class="message-bubble"
              :style="{
              backgroundColor: message.sender === connectedUser
                ? '#3b82f6'
                : stringToColorOpacity30(props.user.username),
              borderColor: message.sender === connectedUser
                ? '#2563eb'
                : stringToColor(props.user.username)
            }"
          >
            {{ message.text }}
          </div>
          <div class="message-time">{{ formatTime(message.timestamp) }}</div>
        </div>
      </div>

      <div v-if="!showVisitedCountries && !showCommonCountries" class="message-input">
        <input
            type="text"
            v-model="newMessage"
            placeholder="Écrivez un message..."
            @keyup.enter="sendMessage"
        />
        <button
            class="send-button"
            :style="{ backgroundColor: stringToColor(props.user.username) }"
            @click="sendMessage"
        >
          <Icon name="mdi:send" class="text-white" />
        </button>
      </div>
    </div>
  </div>
</template>

<style scoped>
.chat-modal {
  position: fixed;
  bottom: 20px;
  right: 20px;
  width: 320px;
  background-color: white;
  border-radius: 12px;
  box-shadow: 0 5px 20px rgba(0, 0, 0, 0.2);
  display: flex;
  flex-direction: column;
  overflow: hidden;
  transition: height 0.3s ease, box-shadow 0.3s ease;
  z-index: 1000;
}

.chat-modal.minimized {
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.15);
}

.chat-header {
  padding: 12px 16px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  cursor: pointer;
  position: relative;
}

.user-info {
  display: flex;
  align-items: center;
  gap: 10px;
}

.avatar {
  width: 32px;
  height: 32px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  font-weight: bold;
}

.username {
  font-weight: 600;
  font-size: 14px;
}

.actions {
  display: flex;
  gap: 8px;
}

.action-button {
  background: none;
  border: none;
  cursor: pointer;
  opacity: 0.7;
  transition: opacity 0.2s;
  display: flex;
  align-items: center;
  justify-content: center;
  width: 28px;
  height: 28px;
  border-radius: 50%;
}

.action-button:hover {
  opacity: 1;
  background-color: rgba(0, 0, 0, 0.05);
}

.chat-content {
  flex: 1;
  display: flex;
  flex-direction: column;
  overflow: hidden;
}

.chat-messages {
  flex: 1;
  overflow-y: auto;
  padding: 16px;
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.empty-chat {
  text-align: center;
  color: #9ca3af;
  margin: auto;
  font-size: 14px;
}

.message {
  display: flex;
  flex-direction: column;
  max-width: 80%;
  margin-bottom: 8px;
}

.own-message {
  align-self: flex-end;
}

.their-message {
  align-self: flex-start;
}

.message-bubble {
  padding: 8px 12px;
  border-radius: 18px;
  font-size: 14px;
  border: 1px solid transparent;
  word-break: break-word;
}

.own-message .message-bubble {
  border-bottom-right-radius: 4px;
  color: white;
}

.their-message .message-bubble {
  border-bottom-left-radius: 4px;
}

.message-time {
  font-size: 10px;
  margin-top: 2px;
  opacity: 0.6;
  align-self: flex-end;
}

.message-input {
  display: flex;
  padding: 12px;
  gap: 8px;
  border-top: 1px solid rgba(0, 0, 0, 0.1);
}

.message-input input {
  flex: 1;
  padding: 8px 12px;
  border-radius: 20px;
  border: 1px solid rgba(0, 0, 0, 0.1);
  outline: none;
  font-size: 14px;
}

.message-input input:focus {
  border-color: rgba(59, 130, 246, 0.5);
  box-shadow: 0 0 0 2px rgba(59, 130, 246, 0.2);
}

.send-button {
  width: 36px;
  height: 36px;
  border-radius: 50%;
  border: none;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: transform 0.2s;
}

.send-button:hover {
  transform: scale(1.05);
}

.countries-panel {
  flex: 1;
  overflow-y: auto;
  padding: 16px;
}

.panel-title {
  font-size: 14px;
  font-weight: 600;
  margin-bottom: 12px;
  text-align: center;
}

.countries-list {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.country-item {
  padding: 8px 12px;
  border-radius: 8px;
  background-color: #f3f4f6;
  font-size: 14px;
}

.country-item.common {
  font-weight: 500;
}

.empty-state {
  text-align: center;
  color: #9ca3af;
  padding: 20px 0;
  font-size: 14px;
}
</style>