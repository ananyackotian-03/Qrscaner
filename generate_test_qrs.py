import qrcode
import os

# Create directory for test QRs
output_dir = "test_qrs"
if not os.path.exists(output_dir):
    os.makedirs(output_dir)

test_cases = [
    {
        "name": "safe_qr.png",
        "data": "https://google.com",
        "description": "Standard safe URL"
    },
    {
        "name": "suspicious_qr.png",
        "data": "https://trusted-service.com/secure/verify/auth?session=a8f2k9l1m0n4b7v2c3x5z6q8w0e1r2t3y4u5i6o7p&redirect=https://internal-portal.xyz",
        "description": "Long URL with high entropy and suspicious TLD redirect"
    },
    {
        "name": "malicious_qr.png",
        "data": "http://192.168.45.12/bank-login/update-verify-account.php",
        "description": "High-risk: IP-based URL with sensitive keywords (bank, login, update)"
    }
]

for case in test_cases:
    print(f"Generating {case['name']}...")
    qr = qrcode.QRCode(version=1, box_size=10, border=5)
    qr.add_data(case['data'])
    qr.make(fit=True)
    
    img = qr.make_image(fill_color="black", back_color="white")
    img.save(os.path.join(output_dir, case['name']))

print(f"\nSuccessfully generated {len(test_cases)} test QR codes in the '{output_dir}' directory.")
