from playwright.sync_api import sync_playwright

with sync_playwright() as p:
    browser = p.chromium.launch(headless=True)
    page = browser.new_page(viewport={'width': 1920, 'height': 1080})

    # Navigate and wait for the page to load
    page.goto('http://localhost:5173')
    page.wait_for_load_state('networkidle')

    # Wait a bit for animations to settle
    page.wait_for_timeout(2000)

    # Take screenshot of intro screen
    page.screenshot(path='screenshot_intro.png', full_page=True)
    print("Screenshot saved: screenshot_intro.png")

    # Get page content for debugging
    content = page.content()
    if "808ILIAS" in content:
        print("Found 808ILIAS text on page")
    if "CLICK TO ENTER" in content:
        print("Found CLICK TO ENTER button")

    browser.close()
