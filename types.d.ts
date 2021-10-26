export interface WalletsResponse{
    results: [
        {
            created_at: string,
            wallet_id: string,
            updated_at: string,
            settings: Object,
            key_manamegent_mode: string
        }
    ]
}

export interface WalletResponse {
    wallet_id: String,
    created_at: String,
    key_management_mode: String,
    updated_at: String,
    settings: {
      'wallet.type': 'indy',
      'wallet.name': 'Testi_Anna_Lompakko2',
      'wallet.webhook_urls': [],
      'wallet.dispatch_type': 'base',
      default_label: 'Testi_Anna',
      'wallet.id': '3251082c-8d05-4711-9dd4-d5fcebf3ee8d'
    },
    token: String
}