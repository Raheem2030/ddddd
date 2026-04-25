import { SubjectContent } from '../../../types';

export const pharmaceutics_1: SubjectContent = {
  "subjectId": "2-1-6",
  "chapters": [
    {
      "id": "ch1",
      "title": "الفصل الأول: مدخل إلى الصيدلانيات",
      "description": "مفاهيم أساسية في علم الصيدلانيات والأشكال الصيدلانية.",
      "capsules": [
        {
          "id": "cap1",
          "title": "الأشكال الصيدلانية الصلبة",
          "description": "دراسة الأقراص والكبسولات",
          "cards": [
            {
              "id": "c1",
              "type": "text",
              "title": "الأقراص (Tablets)",
              "content": [
                "الأقراص هي أشكال صيدلانية صلبة تحتوي على المادة الفعالة مع سواغات (Excipients).",
                "تتميز بسهولة الاستخدام، دقة الجرعة، وثباتية عالية مقارنة بالأشكال السائلة.",
                "تُصنع عادةً بعملية الضغط (Compression).",
                "من أنواعها: الأقراص الفوارة، الأقراص تحت اللسان، والأقراص الملبسة."
              ]
            },
            {
              "id": "c2",
              "type": "media",
              "title": "عملية كبس الأقراص",
              "items": [
                {
                  "id": "m1",
                  "type": "image",
                  "title": "آلة كبس الأقراص",
                  "url": "https://images.unsplash.com/photo-1563213126-a4273aed2016?q=80&w=800&auto=format&fit=crop",
                  "caption": "آلة صناعية تستخدم لضغط المساحيق وتحويلها إلى أقراص صلبة."
                },
                {
                  "id": "m2",
                  "type": "video",
                  "title": "فيديو: مراحل تصنيع الأقراص",
                  "url": "https://www.w3schools.com/html/mov_bbb.mp4",
                  "caption": "مقطع مرئي يوضح عملية الضغط والتشكيل في المصانع الدوائية."
                },
                {
                  "id": "m3",
                  "type": "audio",
                  "title": "ملاحظات صوتية: السواغات",
                  "url": "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-2.mp3",
                  "caption": "شرح صوتي لأنواع السواغات المستخدمة في الأقراص."
                }
              ]
            }
          ]
        }
      ]
    }
  ]
};
