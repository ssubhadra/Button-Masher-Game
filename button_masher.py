
import tkinter as tk
from tkinter import ttk
import csv
import os
from datetime import datetime

def save_results(user_data, total, correct):
    file_exists = os.path.isfile("mash_results.csv")

    with open("mash_results.csv", mode="a", newline="") as file:
        writer = csv.writer(file)
        if not file_exists:
            writer.writerow([
                "timestamp", "timer", "key", "device", "orientation",
                "total_presses", "correct_presses"
            ])
        writer.writerow([
            datetime.now().isoformat(),
            user_data["timer"].get(),
            user_data["key"].get(),
            user_data["device"].get(),
            user_data["orientation"].get(),
            total,
            correct
        ])

def start_game():
    main_window.destroy()  # close setup screen

    game_window = tk.Toplevel()
    game_window.title("Mash Game")
    game_window.geometry("400x300")

    total_presses = tk.IntVar(value=0)
    correct_presses = tk.IntVar(value=0)
    seconds_left = tk.IntVar(value=int(user_data["timer"].get()))
    key_is_held = tk.BooleanVar(value=False)
    selected_key = user_data["key"].get().lower()

    instructions = ttk.Label(game_window, text=f"Start Mashing '{selected_key.upper()}'!", font=("Helvetica", 16))
    instructions.pack(pady=20)

    status_label = ttk.Label(game_window, text="Presses: 0 | Correct: 0", font=("Helvetica", 14))
    status_label.pack(pady=10)

    timer_label = ttk.Label(game_window, text=f"Time left: {seconds_left.get()}s", font=("Helvetica", 14))
    timer_label.pack(pady=10)

    def handle_keypress(event):
        if not key_is_held.get():
            key_is_held.set(True)
            total_presses.set(total_presses.get() + 1)
            if event.char.lower() == selected_key:
                correct_presses.set(correct_presses.get() + 1)
            status_label.config(
                text=f"Presses: {total_presses.get()} | Correct: {correct_presses.get()}"
            )

    def handle_keyrelease(event):
        key_is_held.set(False)

    game_window.bind("<KeyPress>", handle_keypress)
    game_window.bind("<KeyRelease>", handle_keyrelease)

    def countdown():
        seconds_left.set(seconds_left.get() - 1)
        timer_label.config(text=f"Time left: {seconds_left.get()}s")
        if seconds_left.get() > 0:
            game_window.after(1000, countdown)
        else:
            game_window.unbind("<KeyPress>")
            game_window.unbind("<KeyRelease>")
            instructions.config(text="Time's up!")
            total = total_presses.get()
            correct = correct_presses.get()
            status_label.config(text=f"FINAL: Total={total}, Correct={correct}")
            save_results(user_data, total, correct)

    game_window.after(1000, countdown)

# --- SETUP SCREEN ---
main_window = tk.Tk()
main_window.title("Let's Mash Buttons!")
main_window.geometry("400x400")

user_data = {
    "timer": tk.StringVar(value="60"),
    "key": tk.StringVar(value="A"),
    "device": tk.StringVar(value="Laptop"),
    "orientation": tk.StringVar(value="Landscape")
}

ttk.Label(main_window, text="Select Timer (in seconds):").pack(pady=5)
ttk.OptionMenu(main_window, user_data["timer"], "60", "60", "90", "120").pack()

ttk.Label(main_window, text="Choose Key to Mash:").pack(pady=5)
ttk.OptionMenu(main_window, user_data["key"], "A", "A", "S", "W").pack()

ttk.Label(main_window, text="Select Device:").pack(pady=5)
ttk.OptionMenu(main_window, user_data["device"], "Laptop", "Laptop", "Mobile", "iPad").pack()

ttk.Label(main_window, text="Screen Orientation:").pack(pady=5)
ttk.OptionMenu(main_window, user_data["orientation"], "Landscape", "Landscape", "Portrait").pack()

ttk.Button(main_window, text="Start Mashing!", command=start_game).pack(pady=20)

main_window.mainloop()
