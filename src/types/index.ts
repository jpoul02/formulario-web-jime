export interface Question {
  id: number;
  text: string;
}

export interface AnswerIn {
  question_id: number;
  answer_text: string;
}

export interface PhotoOut {
  id: number;
  photo_url: string;
  order: number;
}

export interface AnswerOut {
  id: number;
  question_id: number;
  answer_text: string;
  question: Question;
}

export interface PostalListItem {
  id: number;
  name: string;
  profile_photo_url: string | null;
  created_at: string;
}

export interface PostalDetail {
  id: number;
  name: string;
  profile_photo_url: string | null;
  video_url: string | null;
  created_at: string;
  answers: AnswerOut[];
  photos: PhotoOut[];
}

export interface FormState {
  name: string;
  profilePhotoFile: File | null;
  answers: AnswerIn[];
  videoFile: File | null;
  photoFiles: File[];
  shownQuestionIds: number[];
}
