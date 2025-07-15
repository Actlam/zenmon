// 禅的応答生成システム
export class ZenResponseGenerator {
  private intentPatterns = {
    greeting: ["こんにちは", "はじめまして", "よろしく", "おはよう", "こんばんは"],
    farewell: ["さようなら", "ありがとう", "また", "失礼", "おやすみ"],
    deep_question: ["人生とは", "死とは", "愛とは", "意味とは", "幸せとは", "生きる", "なぜ"],
    practical: ["やり方", "方法", "どうすれば", "教えて", "学び", "始め", "瞑想"],
    emotional: ["辛い", "悲しい", "不安", "怖い", "寂しい", "ストレス", "疲れ", "痛い", "苦しい"]
  };

  private responseTemplates = {
    greeting: {
      morning: ["朝の静けさに包まれて。\n\n今日という日に、何を見つけられるでしょうか？"],
      day: ["日中の光の中で。\n\n今この瞬間に、心はどこにありますか？"],
      evening: ["夕暮れの穏やかさとともに。\n\n一日を振り返って、何を感じますか？"],
      night: ["夜の静寂の中で。\n\nその静けさに、何が宿っているでしょうか？"]
    },
    farewell: [
      "歩む道に、心の平安がありますように。",
      "今日の気づきが、明日の智慧となりますように。",
      "この瞬間の静けさを、心に留めて。"
    ],
    deep_question: [
      "問いそのものが、既に答えを含んでいるかもしれません。\n\nその問いは、どこから生まれたのでしょうか？",
      "言葉で捉えようとするとき、本質は逃げていきます。\n\n言葉を超えたところに、何がありますか？",
      "川は流れることで川であり続けます。\n\nあなたは何であり続けているのでしょうか？",
      "月は指差す指ではありません。\n\n何を探しているのですか？"
    ],
    practical: [
      "座ってください。呼吸を観察してください。\n\nそれだけで十分です。",
      "一歩ずつ。急がず、焦らず。\n\n今できることから始めてみませんか？",
      "答えを求めるより、問いと共に座ってみてください。\n\n何が見えてきますか？",
      "手を開いてください。握りしめているものを手放して。\n\nその空いた手に、何が宿るでしょうか？"
    ],
    emotional: [
      "その痛みも、あなたの一部です。\n\n押し退けず、そっと寄り添ってみませんか？",
      "嵐の中でも、空は変わらず広がっています。\n\nあなたの中にも、そんな静けさがありませんか？",
      "呼吸に意識を向けてください。\n\n吸って、吐いて。今、ここにいることを感じて。",
      "雲は形を変えて流れていきます。\n\n感情もまた、同じではないでしょうか？"
    ],
    general: [
      "風はただ吹いています。\n\nあなたは今、何を感じていますか？",
      "石は投げ込まれた池に波紋を作ります。\n\nその波紋は、やがて静まります。",
      "...。\n\n静寂の中に、すべてがあります。",
      "鳥は歌い、花は咲きます。\n\nそれぞれが、ただあるがままに。"
    ]
  };

  private seasonalElements = {
    spring: ["芽吹き", "桜", "新緑", "そよ風", "始まり"],
    summer: ["青空", "緑陰", "清流", "蝉の声", "生命力"],
    autumn: ["紅葉", "実り", "風涼し", "月", "無常"],
    winter: ["雪", "静寂", "内なる火", "暖炉", "深淵"]
  };

  analyzeIntent(message: string): string {
    for (const [intent, keywords] of Object.entries(this.intentPatterns)) {
      if (keywords.some(keyword => message.includes(keyword))) {
        return intent;
      }
    }
    return "general";
  }

  getCurrentTimeContext(): string {
    const hour = new Date().getHours();
    if (hour >= 5 && hour < 9) return "morning";
    if (hour >= 9 && hour < 17) return "day";
    if (hour >= 17 && hour < 21) return "evening";
    return "night";
  }

  getCurrentSeason(): string {
    const month = new Date().getMonth() + 1;
    if (month >= 3 && month <= 5) return "spring";
    if (month >= 6 && month <= 8) return "summer";
    if (month >= 9 && month <= 11) return "autumn";
    return "winter";
  }

  generateResponse(message: string): string {
    const intent = this.analyzeIntent(message);
    const timeContext = this.getCurrentTimeContext();
    const season = this.getCurrentSeason();

    let templates = this.responseTemplates[intent as keyof typeof this.responseTemplates];
    
    if (intent === "greeting" && typeof templates === "object") {
      templates = (templates as any)[timeContext] || (templates as any)["day"];
    }

    const responseArray = Array.isArray(templates) ? templates : [templates].flat();
    const selectedResponse = responseArray[Math.floor(Math.random() * responseArray.length)];

    // 季節的要素を時々追加
    if (Math.random() < 0.3) {
      const seasonalElement = this.seasonalElements[season][Math.floor(Math.random() * this.seasonalElements[season].length)];
      return `${seasonalElement}の季節。\n\n${selectedResponse}`;
    }

    return selectedResponse;
  }

  // 品質チェック
  validateResponse(response: string): boolean {
    // 長すぎないか（200文字以内）
    if (response.length > 200) return false;
    
    // 判断的な表現を含んでいないか
    const judgmentalWords = ["べき", "しなければ", "間違い", "正しい", "悪い"];
    if (judgmentalWords.some(word => response.includes(word))) return false;
    
    return true;
  }
}