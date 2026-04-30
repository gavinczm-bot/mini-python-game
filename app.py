from flask import Flask, render_template, redirect, url_for

app = Flask(__name__)


@app.route("/")
def home():
    return render_template("index.html")


@app.route("/snake")
def snake():
    return render_template("game.html")


@app.route("/game")
def old_game_link():
    # Keep the old /game URL working
    return redirect(url_for("snake"))


@app.route("/guess-number")
def guess_number():
    return render_template("guess_number.html")


if __name__ == "__main__":
    app.run(debug=True)
