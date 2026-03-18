import requests
import sys
import time
from datetime import datetime

class WealthFarmAPITester:
    def __init__(self, base_url="https://wealth-farm-clone.preview.emergentagent.com/api"):
        self.base_url = base_url
        self.admin_token = None
        self.user_token = None
        self.tests_run = 0
        self.tests_passed = 0
        self.test_results = []

    def log_test(self, name, success, message=""):
        """Log a test result"""
        self.tests_run += 1
        if success:
            self.tests_passed += 1
            status = "✅ PASS"
        else:
            status = "❌ FAIL"
        
        result = f"{status} {name}"
        if message:
            result += f" - {message}"
        
        print(result)
        self.test_results.append({"name": name, "success": success, "message": message})
        return success

    def run_test(self, name, method, endpoint, expected_status, data=None, token=None):
        """Run a single API test"""
        url = f"{self.base_url}/{endpoint}"
        headers = {'Content-Type': 'application/json'}
        if token:
            headers['Authorization'] = f'Bearer {token}'

        try:
            if method == 'GET':
                response = requests.get(url, headers=headers, timeout=10)
            elif method == 'POST':
                response = requests.post(url, json=data, headers=headers, timeout=10)
            elif method == 'PUT':
                response = requests.put(url, json=data, headers=headers, timeout=10)

            success = response.status_code == expected_status
            if success:
                return self.log_test(name, True, f"Status: {response.status_code}"), response.json() if response.text else {}
            else:
                return self.log_test(name, False, f"Expected {expected_status}, got {response.status_code}: {response.text[:100]}"), {}

        except Exception as e:
            return self.log_test(name, False, f"Error: {str(e)}"), {}

    def test_admin_registration(self):
        """Test admin user registration"""
        print("\n🔐 Testing Admin Registration...")
        success, response = self.run_test(
            "Admin Registration",
            "POST",
            "auth/register",
            200,
            data={
                "phone": "51920020786",
                "password": "@N1collas"
            }
        )
        if success and 'token' in response:
            self.admin_token = response['token']
            return self.log_test("Admin Token Retrieved", True, "Admin can login")
        return False

    def test_admin_login(self):
        """Test admin login if registration failed"""
        print("\n🔑 Testing Admin Login...")
        success, response = self.run_test(
            "Admin Login",
            "POST",
            "auth/login",
            200,
            data={
                "phone": "51920020786",
                "password": "@N1collas"
            }
        )
        if success and 'token' in response:
            self.admin_token = response['token']
            return self.log_test("Admin Token Retrieved", True, "Admin logged in successfully")
        return False

    def test_user_registration(self):
        """Test regular user registration"""
        print("\n👤 Testing User Registration...")
        success, response = self.run_test(
            "User Registration",
            "POST",
            "auth/register",
            200,
            data={
                "phone": "11999887766",
                "password": "teste123"
            }
        )
        if success and 'token' in response:
            self.user_token = response['token']
            return self.log_test("User Token Retrieved", True, "User registered successfully")
        return False

    def test_user_login(self):
        """Test user login if registration failed"""
        print("\n🔑 Testing User Login...")
        success, response = self.run_test(
            "User Login",
            "POST",
            "auth/login",
            200,
            data={
                "phone": "11999887766",
                "password": "teste123"
            }
        )
        if success and 'token' in response:
            self.user_token = response['token']
            return self.log_test("User Token Retrieved", True, "User logged in successfully")
        return False

    def test_lot_prices(self):
        """Test lot prices endpoint"""
        print("\n💰 Testing Investment Lots...")
        success, response = self.run_test(
            "Get Lot Prices",
            "GET",
            "lots/prices",
            200
        )
        if success and 'lots' in response:
            lots = response['lots']
            if len(lots) == 3:
                expected_prices = [30.0, 100.0, 300.0]
                expected_rates = [0.10, 0.35, 1.05]
                
                for i, lot in enumerate(lots):
                    if lot['price'] == expected_prices[i] and lot['hourly_rate'] == expected_rates[i]:
                        self.log_test(f"Lot {i+1} Config", True, f"R${lot['price']} - R${lot['hourly_rate']}/hour")
                    else:
                        self.log_test(f"Lot {i+1} Config", False, f"Wrong price/rate")
                return True
        return False

    def test_deposit_flow(self):
        """Test deposit request flow"""
        print("\n💳 Testing Deposit Flow...")
        if not self.user_token:
            return self.log_test("Deposit Flow", False, "No user token")

        # Request deposit
        success, response = self.run_test(
            "Request Deposit",
            "POST",
            "deposits/request",
            200,
            data={
                "amount": 100.0,
                "proof_image_url": "https://example.com/proof.jpg"
            },
            token=self.user_token
        )
        
        if not success:
            return False

        deposit_id = response.get('deposit', {}).get('id')
        if not deposit_id:
            return self.log_test("Deposit ID", False, "No deposit ID returned")

        # Check my deposits
        self.run_test(
            "Get My Deposits",
            "GET",
            "deposits/my-deposits",
            200,
            token=self.user_token
        )

        # Admin approve deposit
        if self.admin_token:
            self.run_test(
                "Admin Approve Deposit",
                "POST",
                "admin/deposits/approve",
                200,
                data={
                    "transaction_id": deposit_id,
                    "approved": True
                },
                token=self.admin_token
            )

        return True

    def test_lot_purchase(self):
        """Test lot purchase"""
        print("\n🏪 Testing Lot Purchase...")
        if not self.user_token:
            return self.log_test("Lot Purchase", False, "No user token")

        # Try to purchase lot 1 (R$ 30)
        success, response = self.run_test(
            "Purchase Lot 1",
            "POST",
            "lots/purchase",
            200,
            data={"lot_type": 1},
            token=self.user_token
        )

        if success:
            # Check my lots
            self.run_test(
                "Get My Lots",
                "GET",
                "lots/my-lots",
                200,
                token=self.user_token
            )

        return success

    def test_withdrawal_flow(self):
        """Test withdrawal request flow"""
        print("\n💸 Testing Withdrawal Flow...")
        if not self.user_token:
            return self.log_test("Withdrawal Flow", False, "No user token")

        # Request withdrawal
        success, response = self.run_test(
            "Request Withdrawal",
            "POST",
            "withdrawals/request",
            200,
            data={
                "amount": 50.0,
                "pix_key_type": "cpf",
                "pix_key": "12345678901"
            },
            token=self.user_token
        )

        if success:
            # Check my withdrawals
            self.run_test(
                "Get My Withdrawals",
                "GET",
                "withdrawals/my-withdrawals",
                200,
                token=self.user_token
            )

        return success

    def test_referral_system(self):
        """Test referral system"""
        print("\n🤝 Testing Referral System...")
        if not self.user_token:
            return self.log_test("Referral System", False, "No user token")

        success, response = self.run_test(
            "Get Referral Stats",
            "GET",
            "referrals/stats",
            200,
            token=self.user_token
        )

        if success and 'referral_code' in response:
            referral_code = response['referral_code']
            self.log_test("Referral Code Generated", True, f"Code: {referral_code}")

            # Test referral registration
            success, _ = self.run_test(
                "Register with Referral",
                "POST",
                "auth/register",
                200,
                data={
                    "phone": "21987654321",
                    "password": "senha123",
                    "referred_by": referral_code
                }
            )

        return success

    def test_admin_endpoints(self):
        """Test admin-only endpoints"""
        print("\n👑 Testing Admin Panel...")
        if not self.admin_token:
            return self.log_test("Admin Panel", False, "No admin token")

        # Test admin stats
        self.run_test(
            "Admin Stats",
            "GET",
            "admin/stats",
            200,
            token=self.admin_token
        )

        # Test pending deposits
        self.run_test(
            "Pending Deposits",
            "GET",
            "admin/deposits/pending",
            200,
            token=self.admin_token
        )

        # Test pending withdrawals
        self.run_test(
            "Pending Withdrawals",
            "GET",
            "admin/withdrawals/pending",
            200,
            token=self.admin_token
        )

        # Test users list
        success, _ = self.run_test(
            "All Users",
            "GET",
            "admin/users",
            200,
            token=self.admin_token
        )

        return success

    def test_pix_config(self):
        """Test PIX configuration"""
        print("\n🔗 Testing PIX Configuration...")
        success, response = self.run_test(
            "PIX Config",
            "GET",
            "config/pix",
            200
        )
        
        if success and 'pix_code' in response:
            pix_code = response['pix_code']
            if len(pix_code) > 50:  # PIX codes are long
                return self.log_test("PIX Code Valid", True, f"Length: {len(pix_code)}")
        
        return self.log_test("PIX Code Valid", False, "Invalid or missing PIX code")

    def run_all_tests(self):
        """Run all tests in sequence"""
        print("🧪 Starting Wealth Farm API Tests...")
        print("=" * 50)

        # Basic authentication tests
        admin_registered = self.test_admin_registration()
        if not admin_registered:
            self.test_admin_login()

        user_registered = self.test_user_registration()
        if not user_registered:
            self.test_user_login()

        # Core functionality tests
        self.test_lot_prices()
        self.test_pix_config()
        
        # User flow tests (require user token)
        self.test_referral_system()
        self.test_deposit_flow()
        self.test_lot_purchase()
        self.test_withdrawal_flow()
        
        # Admin tests (require admin token)
        self.test_admin_endpoints()

        # Summary
        print("\n" + "=" * 50)
        print(f"📊 Test Summary: {self.tests_passed}/{self.tests_run} tests passed")
        
        if self.tests_passed == self.tests_run:
            print("🎉 All tests PASSED!")
            return 0
        else:
            print(f"❌ {self.tests_run - self.tests_passed} tests FAILED")
            return 1

def main():
    """Main test execution"""
    tester = WealthFarmAPITester()
    return tester.run_all_tests()

if __name__ == "__main__":
    sys.exit(main())