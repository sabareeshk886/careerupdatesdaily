# whatsappautomain_fixed.py
"""
Improved continuous WhatsApp sender.
Recovers if browser session reloads or message box disappears.
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
JOB_FILE = r"C:\Users\sabar\OneDrive\Desktop\JobSpy-main\JobSpy-main\neeeefresherfulljobs.txt"
INTERVAL = 600  # 10 minutes
WAIT_TIMEOUT = 30

JS_INJECT = """
const box = arguments[0];
const text = arguments[1] || "";
function escapeHtml(s){return s.replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;');}
const lines = text.split(/\\r?\\n/);
box.focus();
box.innerHTML = lines.map(l=>escapeHtml(l)).join('<br>');
box.dispatchEvent(new InputEvent('input',{bubbles:true}));
"""

def find_message_box(driver):
    for xp in [
        '//footer//div[@contenteditable="true" and not(@data-testid)]',
        '//footer//div[@contenteditable="true"]',
        '//div[@contenteditable="true" and @role="textbox"]'
    ]:
        try:
            elems = driver.find_elements(By.XPATH, xp)
            for el in reversed(elems):
                if el.is_displayed():
                    return el
        except:
            pass
    return None

def paste_via_clipboard(driver, box, text):
    pyperclip.copy(text)
    box.click()
    box.send_keys(Keys.CONTROL, "v")
    time.sleep(0.2)
    box.send_keys(Keys.ENTER)

def open_group(driver, wait):
    try:
        search = wait.until(EC.presence_of_element_located((By.XPATH, '//div[@contenteditable="true" and @data-tab]')))
        search.click()
        search.send_keys(Keys.CONTROL, "a")
        search.send_keys(Keys.BACKSPACE)
        time.sleep(0.5)
        search.send_keys(GROUP_NAME)
        time.sleep(1)
        elem = wait.until(EC.element_to_be_clickable((By.XPATH, f'//span[@title="{GROUP_NAME}"]')))
        elem.click()
        print(f"✅ Opened group: {GROUP_NAME}")
        return True
    except Exception as e:
        print("❌ Failed to open group:", e)
        return False

def ensure_session_alive(driver, wait):
    try:
        driver.current_url  # quick ping
        if "web.whatsapp.com" not in driver.current_url:
            driver.get("https://web.whatsapp.com")
            wait.until(EC.presence_of_element_located((By.ID, "pane-side")))
    except:
        raise Exception("Browser session lost or closed.")

def main():
    print("🚀 Launching WhatsApp continuous sender (auto-recover)...")
    options = webdriver.ChromeOptions()
    options.add_argument(f"--user-data-dir={CHROME_PROFILE_DIR}")
    options.add_argument("--start-maximized")
    options.add_experimental_option("excludeSwitches", ["enable-automation"])
    options.add_experimental_option("useAutomationExtension", False)
    driver = webdriver.Chrome(service=Service(ChromeDriverManager().install()), options=options)
    wait = WebDriverWait(driver, WAIT_TIMEOUT)

    driver.get("https://web.whatsapp.com")
    print("⏳ Waiting for WhatsApp to load...")
    wait.until(EC.presence_of_element_located((By.ID, "pane-side")))
    open_group(driver, wait)

    message_box = find_message_box(driver)
    if not message_box:
        print("⚠️ Please click inside the message box manually, then press ENTER here.")
        input()
        message_box = find_message_box(driver)

    # Load jobs
    with open(JOB_FILE, "r", encoding="utf-8") as f:
        jobs = [j.strip() for j in f.read().split("——————————————————————————————————————————————————") if j.strip()]
    print(f"📦 Loaded {len(jobs)} jobs. Interval = {INTERVAL//60} min\n")

    for i, job in enumerate(jobs, 1):
        try:
            ensure_session_alive(driver, wait)
            message_box = find_message_box(driver) or message_box
            print(f"\n[{i}/{len(jobs)}] Sending: {job[:80]}...")
            try:
                paste_via_clipboard(driver, message_box, job)
            except Exception:
                print("⚠️ Clipboard failed, trying JS fallback...")
                driver.execute_script(JS_INJECT, message_box, job)
                message_box.send_keys(Keys.ENTER)
            print(f"✅ Sent job {i}. Next in {INTERVAL//60} minutes...")
        except Exception as e:
            print("❌ Error during send:", e)
            traceback.print_exc()
            # Try to reopen group if WhatsApp crashed
            driver.get("https://web.whatsapp.com")
            wait.until(EC.presence_of_element_located((By.ID, "pane-side")))
            open_group(driver, wait)
            message_box = find_message_box(driver)
        # Countdown
        for remaining in range(INTERVAL, 0, -1):
            mins, secs = divmod(remaining, 60)
            print(f"⏳ Next job in {mins:02d}:{secs:02d}", end="\r")
            time.sleep(1)

    print("\n✅ All jobs sent. Browser will stay open.")
    # driver.quit()

if __name__ == "__main__":
    main()
