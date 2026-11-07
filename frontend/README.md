Unique referral code: Every user gets their own code.



Referral tracking: When someone registers through a referral link, we record who referred them.

Referral qualification: Track pending and qualified referrals.
Referral statistics: Total, qualified, and pending counts.
Referral history: Return the users referred and their registration dates.
Referral link: Generate it dynamically for each logged-in user.

We'll implement this in the deposit controller.

The rule:
1. User initiates a deposit — referral stays Pending.
2. Deposit is confirmed successful — check whether this is the user's first successful deposit.
3. If it's their first, mark their referral as Qualified.
4. Subsequent deposits must not qualify the referral again.