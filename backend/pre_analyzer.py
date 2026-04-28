import re
import math
from urllib.parse import urlparse

class PreAnalyzer:
    def __init__(self):
        self.suspicious_tlds = ['.xyz', '.top', '.pw', '.club', '.ru', '.tk', '.ga', '.gq', '.cf', '.ml']
        self.malicious_keywords = ['login', 'verify', 'bank', 'secure', 'account', 'update', 'signin', 'wp-admin', 'billing']

    def calculate_entropy(self, string):
        """Calculates the Shannon entropy of a string."""
        if not string:
            return 0
        prob = [float(string.count(c)) / len(string) for c in dict.fromkeys(list(string))]
        entropy = - sum([p * math.log(p) / math.log(2.0) for p in prob])
        return entropy

    def analyze(self, url):
        parsed = urlparse(url)
        domain = parsed.netloc.lower()
        path = parsed.path.lower()
        
        reasons = []
        confidence_score = 0
        
        # 1. URL DNA - Length
        if len(url) > 100:
            reasons.append("Suspiciously long URL")
            confidence_score += 20
            
        # 2. URL DNA - Entropy
        entropy = self.calculate_entropy(url)
        if entropy > 4.5:
            reasons.append(f"High character entropy ({entropy:.2f}) detected")
            confidence_score += 30
            
        # 3. Domain Intelligence - TLD
        if any(url.endswith(tld) for tld in self.suspicious_tlds):
            reasons.append(f"High-risk TLD detected")
            confidence_score += 25
            
        # 4. Domain Intelligence - IP based
        if re.match(r'^(?:[0-9]{1,3}\.){3}[0-9]{1,3}$', domain):
            reasons.append("IP-based domain detected")
            confidence_score += 40
            
        # 5. Keyword Analysis
        found_keywords = [kw for kw in self.malicious_keywords if kw in url.lower()]
        if found_keywords:
            reasons.append(f"Malicious keywords found: {', '.join(found_keywords)}")
            confidence_score += 20
            
        # Predicted Attack Type
        predicted_attack = "GENERIC"
        if "login" in url.lower() or "verify" in url.lower():
            predicted_attack = "PHISHING"
        elif entropy > 5.0 or len(url) > 150:
            predicted_attack = "MALWARE/REDIRECT"
            
        return {
            "predicted_attack": predicted_attack,
            "confidence": min(confidence_score, 100),
            "reasons": reasons,
            "metrics": {
                "length": len(url),
                "entropy": round(entropy, 2),
                "domain": domain
            }
        }
