import sys
import base64

# Receive image data and username from Node.js
image_data = base64.b64encode(sys.argv[2]).decode('utf-8')  # Assuming image as base64 string
user_name = sys.argv[1]

# Process image data (replace with your actual logic)
# ...

# Append "pp" to the username
processed_user_name = f"{user_name}pp"

# Print the processed data to stdout
print(processed_user_name)
print(image_data)
