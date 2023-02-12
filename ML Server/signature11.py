from flask import Flask, request, jsonify
import cv2
import numpy as np
from skimage.metrics import structural_similarity as ssim

app = Flask(__name__)

@app.route('/')
def hello_world():
    return 'Hello, World!'

@app.route('/match', methods=['GET'])
def match():
    # Get the buffer data of the first image
    img_data1 = request.files['img1'].read()
    # Get the buffer data of the second image
    img_data2 = request.files['img2'].read()
    # Read the images from the buffer data
    img1 = cv2.imdecode(np.frombuffer(img_data1, np.uint8), cv2.IMREAD_UNCHANGED)
    img2 = cv2.imdecode(np.frombuffer(img_data2, np.uint8), cv2.IMREAD_UNCHANGED)
    # Turn images to grayscale
    img1 = cv2.cvtColor(img1, cv2.COLOR_BGR2GRAY)
    img2 = cv2.cvtColor(img2, cv2.COLOR_BGR2GRAY)
    # Resize images for comparison
    img1 = cv2.resize(img1, (300, 300))
    img2 = cv2.resize(img2, (300, 300))
    # Calculate similarity value
    similarity_value = "{:.2f}".format(ssim(img1, img2)*100)
    similarity = float(similarity_value)
    # Create the result dictionary
    result = {
        "similarity": similarity
    }
    # Return the result as a JSON object
    return jsonify(result)

if __name__ == '__main__':
    app.run(debug=True)