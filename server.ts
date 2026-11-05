import express, { Request, Response } from 'express';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';
import { GoogleGenAI } from '@google/genai';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());

// Initialize Google GenAI
const apiKey = process.env.GEMINI_API_KEY;
let ai: GoogleGenAI | null = null;

if (apiKey) {
  ai = new GoogleGenAI({
    apiKey,
    httpOptions: {
      headers: {
        'User-Agent': 'aistudio-build',
      },
    },
  });
}

// Fallback pedagogical commentaries for each pair
const fallbackCommentaries: Record<number, { match: string; mismatch: string }> = {
  1: {
    match: 'Tuyệt vời! Các em đã tái hiện được buổi sáng chớm đông ở phố chợ: đất trời bỗng chuyển lạnh buốt với những đợt gió bấc hun hút. Cảnh sắc này làm nổi bật sự đối lập giữa cái lạnh của thiên nhiên và hơi ấm tình người sắp tới.',
    mismatch: 'Hai mảnh kí ức này chưa khớp nhau. Hãy chú ý tìm chi tiết miêu tả sự biến đổi của thời tiết và khung cảnh sớm đầu đông nhé!',
  },
  2: {
    match: 'Chính xác rồi! Hình ảnh bé Hiên co ro bên cột quán trong manh áo rách tả tơi là chi tiết rất xúc động, khơi dậy lòng trắc ẩn và sự đồng cảm tự nhiên nơi chị em Sơn.',
    mismatch: 'Chưa chính xác! Một mảnh đang nói về bé Hiên, hãy tìm chi tiết miêu tả trang phục và dáng vẻ tội nghiệp của em trong cái rét đầu mùa.',
  },
  3: {
    match: 'Rất cảm động! Chiếc áo bông cũ của em Duyên được trao đi không chỉ sưởi ấm thân thể bé Hiên mà còn thắp sáng lòng nhân ái trong sáng, vô tư của hai đứa trẻ.',
    mismatch: 'Hai chi tiết này chưa ghép thành đôi. Hãy tìm mảnh ghép kể về quyết định mang chiếc áo bông cũ đem cho bạn của Sơn và Lan!',
  },
  4: {
    match: 'Đúng rồi! Nỗi sợ mẹ mắng và sự hốt hoảng đi đòi áo là nét tâm lý rất trẻ con và chân thực của Sơn và Lan. Chi tiết này cho thấy các em chưa hoàn hảo nhưng rất ngây thơ, đáng yêu.',
    mismatch: 'Chưa đúng rồi! Hãy tìm mảnh ghép thể hiện tâm lý hoang mang, lo lắng của hai chị em khi chợt nhận ra mình đã tự ý đem áo đi cho.',
  },
  5: {
    match: 'Xuất sắc! Sự xuất hiện của hai người mẹ khép lại câu chuyện thật trọn vẹn: mẹ Hiên thật thà trả áo, còn mẹ Sơn bao dung cho vay tiền may áo ấm. Đó là tình người ấm áp giữa đời thường.',
    mismatch: 'Chưa khớp nhau! Mảnh này liên quan đến cái kết đầy tình người giữa mẹ của Sơn và mẹ của bé Hiên. Hãy thử lại nhé!',
  },
};

// API Endpoint for AI Commentary
app.post('/api/gemini/commentary', async (req: Request, res: Response) => {
  const { pairId, pairTitle, isMatch, card1Text, card2Text } = req.body;

  const defaultResponse = fallbackCommentaries[pairId]
    ? (isMatch ? fallbackCommentaries[pairId].match : fallbackCommentaries[pairId].mismatch)
    : (isMatch
        ? `Tuyệt vời! Các em đã tìm thấy một mảnh kí ức quý giá về "${pairTitle}". Hãy cùng suy ngẫm về ý nghĩa của chi tiết này!`
        : 'Hai mảnh kí ức này chưa thuộc về nhau rồi! Hãy đọc kĩ từng câu chữ để tìm ra mối liên hệ chính xác nhé!');

  if (!ai || !apiKey) {
    return res.json({ commentary: defaultResponse, source: 'fallback' });
  }

  try {
    const prompt = `Bạn là Người Dẫn Chuyện (vai Thủ thư Mùa Đông / Cú Mèo Kí Ức) trong webgame tương tác môn Ngữ văn lớp 6, bài học "Gió lạnh đầu mùa" (Thạch Lam).
Người chơi vừa lật 2 thẻ:
- Thẻ 1: "${card1Text || ''}"
- Thẻ 2: "${card2Text || ''}"
- Kết quả ghép: ${isMatch ? 'CHÍNH XÁC (ĐÚNG CẶP)' : 'SAI (CHƯA ĐÚNG CẶP)'}
- Chủ đề sự việc: "${pairTitle || 'Sự việc trong truyện'}"

Yêu cầu:
1. Độ dài: Đúng 2 đến 3 câu văn (khoảng 40-70 từ), súc tích, dễ đọc trên màn hình lớp học.
2. Giọng điệu: Ấm áp, truyền cảm, dí dỏm, khích lệ học sinh lớp 6. Tuyệt đối không chê bai khi sai mà đưa ra gợi ý liên tưởng nhẹ nhàng.
3. Nếu đúng: Khẳng định ngắn gọn và làm nổi bật vẻ đẹp tình người hoặc tâm lý nhân vật.
4. Nếu sai: Đưa ra gợi ý thông minh, gợi mở chi tiết liên quan.
5. Chỉ trả về nội dung lời nói trực tiếp của bạn (không ghi tiền tố như "Người dẫn chuyện:" hay đặt trong ngoặc kép).`;

    const response = await ai.models.generateContent({
      model: 'gemini-3.8-flash',
      contents: prompt,
    });

    const aiText = response.text?.trim();
    if (aiText) {
      return res.json({ commentary: aiText, source: 'gemini' });
    }
    return res.json({ commentary: defaultResponse, source: 'fallback' });
  } catch (error) {
    console.error('Gemini API error, using fallback:', error);
    return res.json({ commentary: defaultResponse, source: 'fallback' });
  }
});

// Configure Vite middleware in development or serve static in production
async function startServer() {
  if (process.env.NODE_ENV !== 'production') {
    const { createServer: createViteServer } = await import('vite');
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.resolve(__dirname, 'dist');
    app.use(express.static(distPath));
    app.get('*', (_req: Request, res: Response) => {
      res.sendFile(path.resolve(distPath, 'index.html'));
    });
  }

  app.listen(PORT, () => {
    console.log(`Server is running at http://localhost:${PORT}`);
  });
}

startServer();
