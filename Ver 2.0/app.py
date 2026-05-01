from flask import Flask, render_template, redirect, url_for, request

app = Flask(__name__)


@app.route("/")
def home():
    return render_template("index.html")


@app.route("/scarlett")
def scarlett():
    return render_template("scarlett.html")


@app.route("/snake")
def snake():
    mode = request.args.get("mode", "normal")
    is_scarlett = mode == "scarlett"
    return render_template("game.html", is_scarlett=is_scarlett)


@app.route("/game")
def old_game_link():
    # Keep the old /game URL working
    return redirect(url_for("snake"))


@app.route("/guess-number")
def guess_number():
    return render_template("guess_number.html")


if __name__ == "__main__":
    app.run(debug=True)
