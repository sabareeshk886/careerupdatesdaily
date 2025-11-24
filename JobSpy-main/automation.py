"""
automation_pyautogui.py

Behavior:
- Reads ITIND.txt and splits jobs by the SEPARATOR.
- Sends one job at a time to the currently open/active WhatsApp group chat (Testt).
- Uses clipboard (pyperclip) + pyautogui to paste and press Enter (works with emojis).
- Attempts to activate a window titled 'WhatsApp' (WhatsApp Web in Chrome/Edge, or WhatsApp Desktop).
- Falls back to asking you to focus the chat manually if it can't auto-activate.

Run:
C:/Users/sabar/OneDrive/Desktop/JobSpy-main/JobSpy-main/.venv/Scripts/python.exe automation_pyautogui.py
"""

import time
import os
import sys
import pyperclip
import pyautogui
import traceback

# try to import pygetwindow for window activation (optional but helpful)
try:
    import pygetwindow as gw
    HAVE_PYGETWINDOW = True
except Exception:
    HAVE_PYGETWINDOW = False

# ---------------- CONFIG ----------------
TXT_FILE = "ITIND.txt"
SEPARATOR = "——————————————————————————————————————————————————"
SENT_JOBS_FILE = "sent_jobs.txt"
INTERVAL_SECONDS = 60   # 1 minute
GROUP_WINDOW_TITLE_KEYWORD = "WhatsApp"   # used to find and activate window (case-sensitive-ish)
# ----------------------------------------

pyautogui.FAILSAFE = True  # move mouse to top-left corner to abort instantly if needed
pyautogui.PAUSE = 0.2      # small pause after actions

def read_jobs(file_path):
    if not os.path.exists(file_path):
        return []
    with open(file_path, "r", encoding="utf-8") as f:
        content = f.read()
    jobs = [j.strip() for j in content.split(SEPARATOR) if j.strip()]
    return jobs

def read_sent_jobs():
    if not os.path.exists(SENT_JOBS_FILE):
        return []
    with open(SENT_JOBS_FILE, "r", encoding="utf-8") as f:
        return [line.rstrip("\n") for line in f.readlines()]

def mark_job_sent(job):
    with open(SENT_JOBS_FILE, "a", encoding="utf-8") as f:
        f.write(job + "\n")

def activate_whatsapp_window():
    """
    Try to activate a window containing GROUP_WINDOW_TITLE_KEYWORD (e.g. 'WhatsApp').
    Returns True if successfully activated a window, False otherwise.
    """
    if not HAVE_PYGETWINDOW:
        return False

    try:
        wins = gw.getWindowsWithTitle(GROUP_WINDOW_TITLE_KEYWORD)
        if not wins:
            # try case-insensitive search by scanning all windows
            for w in gw.getAllTitles():
                if w and GROUP_WINDOW_TITLE_KEYWORD.lower() in w.lower():
                    win = gw.getWindowsWithTitle(w)[0]
                    win.activate()
                    return True
            return False

        # prefer the first visible window
        for w in wins:
            if w.isVisible:
                try:
                    w.activate()
                    return True
                except Exception:
                    pass
        # fallback: activate first
        try:
            wins[0].activate()
            return True
        except Exception:
            return False
    except Exception:
        return False

def paste_and_send(text):
    """
    Copies text to clipboard, pastes into the active window using Ctrl+V, and presses Enter.
    Assumes the WhatsApp group chat input is focused (or the window is active).
    """
    pyperclip.copy(text)
    # small delay to allow clipboard to settle
    time.sleep(0.15)
    # paste
    pyautogui.hotkey('ctrl', 'v')
    time.sleep(0.08)
    # press Enter to send
    pyautogui.press('enter')

def confirm_ui_ready():
    """
    Try to bring WhatsApp to front. If fails, instruct user to focus the chat manually.
    """
    ok = activate_whatsapp_window()
    if ok:
        print("WhatsApp window activated. Make sure the target group chat (Testt) is visible and active.")
        time.sleep(1.0)
        return True
    else:
        print("Could not automatically activate WhatsApp window.")
        print("Please: open WhatsApp Web (or WhatsApp Desktop), click on the 'Testt' group chat so the message box is active,")
        print("then return here and press ENTER to continue.")
        input("Press ENTER after you have focused the group chat...")
        return True

def main():
    print("Starting pyautogui-based WhatsApp sender (clipboard paste method).")
    print("Make sure your chat 'Testt' is open and visible on screen.")
    time.sleep(1.0)

    if not confirm_ui_ready():
        print("UI not ready. Exiting.")
        return

    all_jobs = read_jobs(TXT_FILE)
    if not all_jobs:
        print(f"No jobs found in {TXT_FILE}. Exiting.")
        return

    sent_jobs = read_sent_jobs()
    remaining = [j for j in all_jobs if j not in sent_jobs]
    if not remaining:
        print("No new jobs to send (all already sent).")
    else:
        print(f"{len(remaining)} new job(s) to send. Starting...")

    try:
        while True:
            all_jobs = read_jobs(TXT_FILE)
            sent_jobs = read_sent_jobs()
            remaining = [j for j in all_jobs if j not in sent_jobs]

            if not remaining:
                print(f"[{time.strftime('%Y-%m-%d %H:%M:%S')}] No new jobs. Checking again in 60s...")
                time.sleep(60)
                continue

            for job in remaining:
                try:
                    # ensure the WhatsApp chat is active before pasting
                    # Attempt to auto-activate each time (in case focus is lost)
                    activate_whatsapp_window()
                    # brief pause
                    time.sleep(0.3)
                    print(f"[{time.strftime('%Y-%m-%d %H:%M:%S')}] Sending job (preview): {job[:80].replace(chr(10),' ')}...")
                    paste_and_send(job)
                    mark_job_sent(job)
                    # wait interval
                    time.sleep(INTERVAL_SECONDS)
                except KeyboardInterrupt:
                    print("Interrupted by user. Exiting.")
                    return
                except Exception as e:
                    print("Error sending job:", e)
                    traceback.print_exc()
                    # short wait then continue with next job / retry loop
                    time.sleep(5)
                    continue

    except KeyboardInterrupt:
        print("Stopped by user. Goodbye.")

if __name__ == "__main__":
    main()
