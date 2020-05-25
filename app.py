from boggle import Boggle
from flask import Flask, request, render_template, session, jsonify, redirect
from flask_debugtoolbar import DebugToolbarExtension

boggle_game = Boggle()

app = Flask(__name__)
app.config["SECRET_KEY"] = "boggle secret"

debug = DebugToolbarExtension(app)

@app.route('/')
def show_new_board():
    """show new boggle board"""
    board = boggle_game.make_board()
    session['board'] = board
    
    return render_template('board.html', board=board)

@app.route('/guess')
def handle_guess():
    """handle user guess"""
    word = request.args['guess']
    board = session['board']
    result = boggle_game.check_valid_word(board, word)
    response = { 'result' : result }

    return jsonify(response)

@app.route('/timeout', methods=["POST"])
def handle_timeout():
    """increment plays and update highscore"""
    
    score = request.json['score']
    highscore = max(score, session.get('highscore', 0))
    session['play_count'] = session.get('play_count', 0) + 1
    session['highscore'] = highscore

    return render_template('thanks.html', score=score)
