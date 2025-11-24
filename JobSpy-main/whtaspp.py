import pandas as pd
import time
from selenium import webdriver
from selenium.webdriver.chrome.service import Service
from selenium.webdriver.common.by import By
from selenium.webdriver.chrome.options import Options
from selenium.common.exceptions import NoSuchElementException
from webdriver_manager.chrome import ChromeDriverManager

# ------------------------------
# 1️⃣ Load Excel data
# ------------------------------
excel_file = "analystindjobs.csv"
df = pd.read_csv(excel_file)
print(f"Loaded {len(df)} jobs from Excel.\n")

# ------------------------------
# 2️⃣ Setup Selenium Chrome
# ------------------------------
options = Options()
options.add_argument("--user-data-dir=C:/Users/sabar/ChromeWhatsApp")  # preserve login
options.add_argument("--profile-directory=Default")
options.add_argument("--start-maximized")
options.add_argument("--disable-notifications")

driver = webdriver.Chrome(
    service=Service(ChromeDriverManager().install()),
    options=options
)

driver.get("https://web.whatsapp.com")
print("🔑 Checking WhatsApp Web login...")

# ------------------------------
# 3️⃣ Wait for login
# ------------------------------
logged_in = False
while not logged_in:
    time.sleep(3)
    try:
        driver.find_element(By.XPATH, '//div[@id="pane-side"]')  # chat pane
        logged_in = True
        print("✅ Logged in to WhatsApp Web!")
    except NoSuchElementException:
        print("⌛ Waiting for WhatsApp Web login (scan QR if needed)...")

# ------------------------------
# 4️⃣ WhatsApp recipient
# ------------------------------
target_contact = "Event Updates"

# ------------------------------
# 5️⃣ Send messages one by one
# ------------------------------
for index, row in df.iterrows():
    # Construct message
    message = f"""*Job Title:* {row['title']}
*Company:* {row['company']}
*Location:* {row['location']}
*Date Posted:* {row['date_posted']}
*Job URL:* {row['job_url_direct']}"""

    # Preview in terminal
    print(f"\n--- Job {index+1}/{len(df)} ---")
    print(message)
    print("============================")

    try:
        # Locate chat search
        search_box = driver.find_element(By.XPATH, '//div[@contenteditable="true"][@data-tab="3"]')
        search_box.clear()
        search_box.send_keys(target_contact)
        time.sleep(2)

        # Click on chat
        chat = driver.find_element(By.XPATH, f'//span[@title="{target_contact}"]')
        chat.click()
        time.sleep(2)

        # Locate message input
        input_box = driver.find_element(By.XPATH, '//div[@contenteditable="true"][@data-tab="10"]')
        input_box.send_keys(message)
        input_box.send_keys("\n")  # Enter to send
        print(f"✅ Message sent for Job {index+1}")

    except Exception as e:
        print(f"❌ Failed to send Job {index+1}: {e}")

    # Delay before sending next message
    time.sleep(10)  # change to 900 for 15 minutes

print("🎉 All messages processed.")
