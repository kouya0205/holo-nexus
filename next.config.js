module.exports = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'jvklishfjzxpggcpjtxe.supabase.co', // Supabase のホスト名
        port: '', // ポートが必要なければ空欄
        pathname: '/**', // すべてのパスを許可
      },
    ],
  },
  typescript: {
    // !! 警告 !!
    // あなたのプロジェクトに型エラーがあったとしても、プロダクションビルドを正常に完了するために危険な許可をする。
    // !! 警告 !!
    ignoreBuildErrors: true
  }
};

