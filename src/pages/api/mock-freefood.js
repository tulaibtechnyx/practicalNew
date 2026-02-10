const delay = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

const DataRepsonse = {
  "data": {
    "referral_discount": {
      "id": 7255,
      "title": "Musaib9211",
      "promo_code": "MUSAIB9211",
      "promo_type": "All",
      "associated_emails": [],
      "ambassador_email": null,
      "ambassador_user_id": null,
      "ambassador_referral_codes": [],
      "wallet_credit_ratio": null,
      "promo_restrictions": "all_customers",
      "team_member": null,
      "created_on": null,
      "validity_type": "duration",
      "duration_from_creation": null,
      "duration_from_use": null,
      "max_use_per_customer": null,
      "max_use_total": null,
      "discount_on": [],
      "status": 0,
      "type": "All",
      "value": 20,
      "key": "referal_friend",
      "start_date": null,
      "expiry_date": null,
      "users": "[6325]",
      "length_plan_weeks": [],
      "is_multi_use": 0,
      "meal": ["All"],
      "snack": ["All"],
      "days": ["All"],
      "company_id": null,
      "parent_id": null,
      "parent": null
    },
    "refer_discount_tier": [{
      "week": 1,
      "reward_value": "10.00",
      "referrer_amount": "10.00"
    }, {
      "week": 2,
      "reward_value": "15.00",
      "referrer_amount": "25.00"
    }, {
      "week": 4,
      "reward_value": "20.00",
      "referrer_amount": "50.00"
    }]
  }
}

export default async function handler(req, res) {
    await delay(500); // Delay for 500ms
    res.status(200).json(DataRepsonse);
}
