import Word from "../models/word";

interface FindWordsOptions {
  page?: number;
  limit?: number;
  search?: string;
  startLetter?: string;
}

interface FindWordsResult {
  words: Array<{ word: string }>;
  totalDocs: number;
  page: number;
  totalPages: number;
  hasNext: boolean;
  hasPrev: boolean;
}

const findWords = async ({
  page = 1,
  limit = 20,
  search = "",
  startLetter = "",
}: FindWordsOptions): Promise<FindWordsResult> => {
  const filter: any = {
    word: {
      $regex: `^${search}\\b`,
      $options: "i",
    },
  };

  if (startLetter) {
    filter.word.$regex = `^${startLetter}`;
  }

  const words = await Word.find(filter)
    .limit(parseInt(limit as any))
    .skip((parseInt(page as any) - 1) * parseInt(limit as any))
    .exec();

  const totalDocs = await Word.countDocuments(filter);

  return {
    words,
    totalDocs,
    page: parseInt(page as any),
    totalPages: Math.ceil(totalDocs / limit),
    hasNext: parseInt(page as any) * limit < totalDocs,
    hasPrev: parseInt(page as any) > 1,
  };
};

const findWordByWord = async (word: string) => {
  return await Word.findOne({ word }).exec();
};

export { findWords, findWordByWord };
