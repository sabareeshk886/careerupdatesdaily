# whatsapp_continuous_sender.py
"""
Sends jobs from ITIND.txt to the Career Updates Daily group every 1 minute.
Requires the previous working Chrome profile.
"""

import time, traceback, pyperclip
from selenium import webdriver
from selenium.webdriver.common.by import By
from selenium.webdriver.common.keys import Keys
from selenium.webdriver.chrome.service import Service
from selenium.webdriver.support.ui import WebDriverWait
from selenium.webdriver.support import expected_conditions as EC
from webdriver_manager.chrome import ChromeDriverManager

CHROME_PROFILE_DIR = r"C:\Users\sabar\OneDrive\Desktop\JobSpy-main\JobSpy-main\whatsapp_selenium_profile"
GROUP_NAME = "Career Updates Daily"
JOB_FILE = r"C:\Users\sabar\OneDrive\Desktop\JobSpy-main\JobSpy-main\haifulljobs.txt"
INTERVAL = 60  # seconds between jobs
WAIT_TIMEOUT = 30

JS_INJECT = """
const box = arguments[0];
const text = arguments[1] || "";
function escapeHtml(s) { return s.replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;'); }
const lines = text.split(/\\r?\\n/);
box.focus();
box.innerHTML = lines.map(l => escapeHtml(l)).join('<br>');
box.dispatchEvent(new InputEvent('input', {bubbles: true}));
"""

def find_search_box(driver):
    xps = [
        '//div[@contenteditable="true" and @data-tab]',
        '//div[@contenteditable="true" and @title="Search input textbox"]',
        '//div[@contenteditable="true"]'
    ]
    for xp in xps:
        try:
            elems = driver.find_elements(By.XPATH, xp)
            if elems:
                for el in elems:
                    if el.is_displayed():
                        return el
        except:
            pass
    return None

def find_message_box(driver):
    xps = [
        '//footer//div[@contenteditable="true" and not(@data-testid)]',
        '//footer//div[@contenteditable="true"]',
        '//div[@contenteditable="true" and @data-tab]',
        '//div[@contenteditable="true" and @role="textbox"]',
        '//div[@contenteditable="true"]'
    ]
    for xp in xps:
        try:
            elems = driver.find_elements(By.XPATH, xp)
            if elems:
                for el in reversed(elems):
                    if el.is_displayed():
                        return el
        except:
            pass
    return None

def paste_via_clipboard(driver, message_box, text):
    pyperclip.copy(text)
    try:
        message_box.click()
    except:
        pass
    message_box.send_keys(Keys.CONTROL, "v")
    time.sleep(0.15)
    message_box.send_keys(Keys.ENTER)

def main():
    print("Launching WhatsApp Continuous Job Sender...")
    options = webdriver.ChromeOptions()
    options.add_argument(f"--user-data-dir={CHROME_PROFILE_DIR}")
    options.add_argument("--start-maximized")
    options.add_experimental_option("excludeSwitches", ["enable-automation"])
    options.add_experimental_option("useAutomationExtension", False)

    driver = webdriver.Chrome(service=Service(ChromeDriverManager().install()), options=options)
    wait = WebDriverWait(driver, WAIT_TIMEOUT)

    driver.get("https://web.whatsapp.com")
    print("Waiting for WhatsApp Web to load...")
    wait.until(EC.presence_of_element_located((By.ID, "pane-side")))

    # Open group
    try:
        search_box = find_search_box(driver)
        search_box.click()
        search_box.send_keys(Keys.CONTROL, "a")
        search_box.send_keys(Keys.BACKSPACE)
        time.sleep(0.5)
        search_box.send_keys(GROUP_NAME)
        time.sleep(1)
        group_xpath = f'//span[@title="{GROUP_NAME}"]'
        elem = wait.until(EC.element_to_be_clickable((By.XPATH, group_xpath)))
        elem.click()
        print(f"Opened group: {GROUP_NAME}")
    except Exception as e:
        print("Failed to open group:", e)
        driver.quit()
        return

    message_box = find_message_box(driver)
    if message_box is None:
        print("Could not find message box. Click message input manually then press Enter here...")
        input()
        message_box = find_message_box(driver)
        if message_box is None:
            print("Still can't find message box. Exiting.")
            driver.quit()
            return

    # Read jobs from file
    with open(JOB_FILE, "r", encoding="utf-8") as f:
        jobs = f.read().split("——————————————————————————————————————————————————")

    jobs = [j.strip() for j in jobs if j.strip()]
    print(f"{len(jobs)} job(s) loaded. Starting send loop every {INTERVAL} seconds...")

    try:
        for idx, job in enumerate(jobs, start=1):
            print(f"[{idx}/{len(jobs)}] Sending job (preview): {job[:80]}...")
            try:
                paste_via_clipboard(driver, message_box, job)
            except Exception:
                print("Clipboard failed, trying JS fallback...")
                driver.execute_script(JS_INJECT, message_box, job)
                message_box.send_keys(Keys.ENTER)
            print(f"Sent job {idx}. Waiting {INTERVAL} seconds before next...")
            time.sleep(INTERVAL)
    except KeyboardInterrupt:
        print("Stopping due to keyboard interrupt.")
    except Exception:
        traceback.print_exc()
    finally:
        print("Finished sending jobs. Browser will remain open for inspection.")
        # driver.quit()  # optional: comment this to leave Chrome open

if __name__ == "__main__":
    main()
