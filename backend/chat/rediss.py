import redis
from typing import List
from datetime import datetime
from typing import List
import json
from config.configs import settings
seting=settings()

class RedisClient:
    def __init__(self):
        # Initialize Redis connection
        self.redis = redis.StrictRedis(host=seting.REDIS_HOST,port=seting.REDIS_PORT,db=seting.REDIS_DB,decode_responses=True)
    
    def set_status(self, key: str, status: str):
        self.redis.set(key, status)

    def store_message(self, sender_id: str, receiver_id: str, message: str):
        timestamp = datetime.now().timestamp()
        key = f"conversation:{sender_id}:to:{receiver_id}"
        print("stage1")
        message_data = {
            "timestamp": timestamp,
            "message": message,
            "sender_id": sender_id,
            "receiver_id": receiver_id
        }
        print("stage2")
        self.redis.zadd(key, {json.dumps(message_data): timestamp})

    def get_conversation_messages(self, sender_id: str, receiver_id: str, limit: int = 100) -> List[dict]:
        print("sender_id, receiver_id", sender_id, receiver_id)
    
    # Construct Redis keys for both directions
        key1 = f"conversation:{sender_id}:to:{receiver_id}"
        key2 = f"conversation:{receiver_id}:to:{sender_id}"  
        messages_sender_to_receiver = self.redis.zrevrange(key1, 0, limit - 1, withscores=True)
        messages_receiver_to_sender = self.redis.zrevrange(key2, 0, limit - 1, withscores=True)
        messages = messages_receiver_to_sender + messages_sender_to_receiver
        sorted_data = sorted(messages, key=lambda x: json.loads(x[0])['timestamp'], reverse=False)
        result = [{'message': json.loads(x[0])['message'], 'sender_ID': json.loads(x[0])['sender_id'], 'receiver_ID': json.loads(x[0])['receiver_id']} for x in sorted_data]
        return result