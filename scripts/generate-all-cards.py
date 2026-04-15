import os
import requests
import json
import re

API_KEY = "sk-1WtbbHyxApD05Vk3dFxEbqTH16OBpI9ZG9Ia8pKBZJrozLsG"
ENDPOINT = "https://api.apimart.ai/v1/chat/completions"
MODEL_NAME = "gemini-3.1-flash-image-preview"

def generate_image(filename, prompt_text):
    print(f"🎨 Generating image via {MODEL_NAME} for: {filename}...")
    
    headers = {
        "Content-Type": "application/json",
        "Authorization": f"Bearer {API_KEY}"
    }
    
    # Using Gemini via Chat Completions endpoint, forcing vertical 2:3 ratio in text
    payload = {
        "model": MODEL_NAME,
        "messages": [
            {"role": "user", "content": f"{prompt_text}. Aspect ratio: 2:3 (vertical orientation)"}
        ]
    }
    
    try:
        response = requests.post(ENDPOINT, headers=headers, json=payload)
        response.raise_for_status()
        
        data = response.json()
        if "error" in data:
            print(f"❌ API Error:", data["error"])
            return

        full_content = data["choices"][0]["message"]["content"]
        
        # Apimart's Gemini wrapper returns Markdown or Raw URL
        image_url = None
        markdown_match = re.search(r'!\[.*?\]\(([^)]+)\)', full_content, re.IGNORECASE)
        if markdown_match:
            image_url = markdown_match.group(1)
        else:
            raw_url_match = re.search(r'(https?://[^\s\"\']+|data:image/[^\s\"\']+)', full_content, re.IGNORECASE)
            if raw_url_match:
                image_url = raw_url_match.group(1)
                
        if not image_url:
            print(f"❌ Could not find image URL in response content: {full_content[:200]}")
            return
            
        print(f"🔗 Found Image URL, downloading...")
        
        dest_path = os.path.join(os.getcwd(), 'public', 'cards', filename)
        
        # If it's a base64 string
        if image_url.startswith('data:image'):
            import base64
            header, encoded = image_url.split(",", 1)
            img_data = base64.b64decode(encoded)
            with open(dest_path, 'wb') as f:
                f.write(img_data)
        else:
            img_response = requests.get(image_url)
            img_response.raise_for_status()
            with open(dest_path, 'wb') as f:
                f.write(img_response.content)
            
        print(f"✅ Successfully saved: {dest_path}")
        
    except requests.exceptions.RequestException as e:
        print(f"❌ Failed to generate {filename}: {e}")
        if e.response is not None:
            print("Response:", e.response.text)

if __name__ == "__main__":
    prompt = '"Gilded Shadow" tarot card illustration. THIS MUST BE A TALL VERTICAL RECTANGLE. No text. Completely symmetrical pattern, perfect for a card back. Deep black void background. Design features intertwined Art Nouveau gold leaf vines, a central geometric Art Deco sun or eye motif, surrounded by mystical cosmic stars. Highly intricate, perfectly symmetrical from top to bottom and left to right. All line work is rendered in fine gold leaf with a luminous golden glow. No cartoony elements. Museum-quality craftsmanship, mystical, premium feel.'
    generate_image("card-back-external.png", prompt)
