
from flask import Flask, render_template, request, jsonify
import requests
import os
from dotenv import load_dotenv

load_dotenv()  # Load API keys from .env

app = Flask(__name__)

# Load API Keys
app.config["WEATHER_API_KEY"] = os.getenv("WEATHER_API_KEY")
app.config["GEOAPIFY_API_KEY"] = os.getenv("GEOAPIFY_API_KEY")

@app.route("/")
def home():
    google_api_key = os.getenv('GOOGLE_API_KEY') 
    return render_template("index.html")

@app.route("/weather", methods=["GET"])
def get_weather():
    city = request.args.get("city")
    if not city:
        return jsonify({"error": "City is required"}), 400

    url = f"https://api.openweathermap.org/data/2.5/weather?q={city}&appid={app.config['WEATHER_API_KEY']}&units=metric"
    response = requests.get(url)

    if response.status_code != 200:
        return jsonify({"error": "Failed to fetch weather data"}), 500

    return jsonify(response.json())

@app.route("/weather/coords", methods=["GET"])
def get_weather_by_coords():
    lat = request.args.get("lat")
    lon = request.args.get("lon")

    if not lat or not lon:
        return jsonify({"error": "Latitude and longitude are required"}), 400

    url = f"https://api.openweathermap.org/data/2.5/weather?lat={lat}&lon={lon}&appid={app.config['WEATHER_API_KEY']}&units=metric"
    response = requests.get(url)

    if response.status_code != 200:
        return jsonify({"error": "Failed to fetch weather data"}), 500

    return jsonify(response.json())

@app.route("/autocomplete", methods=["GET"])
def autocomplete():
    query = request.args.get("query")
    if not query:
        return jsonify({"error": "Query is required"}), 400

    geoapify_url = f"https://api.geoapify.com/v1/geocode/autocomplete?text={query}&apiKey={app.config['GEOAPIFY_API_KEY']}"
    response = requests.get(geoapify_url)

    if response.status_code != 200:
        return jsonify({"error": "Failed to fetch autocomplete data"}), 500

    return jsonify(response.json())

if __name__ == "__main__":
    app.run(debug=True)
