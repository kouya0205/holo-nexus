import { Box, Button, Typography } from "@mui/material";

export default function Complete({ handleReset }: { handleReset: () => void }) {
  return (
    <Box sx={{ textAlign: "center", mt: 3 }}>
      <Typography variant="h6">デッキ作成完了</Typography>
      <Typography variant="body1">デッキの作成が完了しました。</Typography>
      <Box sx={{ display: "flex", flexDirection: "row", pt: 2 }}>
        <Box sx={{ flex: "1 1 auto" }} />
        <Button onClick={handleReset}>最初からやり直す</Button>
      </Box>
    </Box>
  );
}
