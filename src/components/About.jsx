// src/pages/About.jsx
import React from 'react';
import img1 from '../assets/00-1.png';

const About = () => {
  return (
    <div dir="rtl" className="bg-white text-gray-800">
      <section className="max-w-6xl mx-auto py-16 px-4 md:px-8">
        <div className="flex flex-col md:flex-row-reverse items-center gap-10">
          {/* الصورة */}
          <div className="md:w-1/2">
            <img
              src={img1}
              alt="ماهـين كولكشن 🌙 - أناقة عُمانية بروح عصرية"
              className="w-full max-w-md mx-auto rounded-xl shadow-lg"
            />
          </div>

          {/* النص */}
          <div className="md:w-1/2">
            <h2 className="text-4xl font-bold text-[#64472b] mb-4">
              ماھين كولكشن 🌙
              <br />
              <span>براند عُماني… يروي حكاية أناقة</span>
            </h2>

            {/* القصة */}
            <p className="text-lg leading-loose mb-4">
              بدأت <span className="font-semibold text-[#64472b]">ماهـين كولكشن 🌙</span> 
              من شغفٍ بسيط بالخياطة والتصميم، وشوقٍ لتقديم العباية والزي العُماني بروح عصرية تناسب المرأة الحديثة. 
              الاسم <span className="font-semibold">ماهـين</span> يعني في معناه “الضياء الهادئ”، وهو الرمز الذي اخترناه ليعكس شخصية كل امرأة أنيقة: 
              حضور هادئ، لكنه يترك أثرًا خالدًا.
            </p>

            <p className="leading-loose mb-4">
              أولى خطواتنا كانت عبر منصات التواصل الاجتماعي، حيث قدمنا قطعًا
              محدودة صُنعت بعناية وحب، وسرعان ما لاقت تفاعلًا كبيرًا من
              النساء اللواتي يبحثن عن التوازن بين البساطة والتميّز. 
              اليوم، توسعنا لتصبح <span className="font-semibold text-[#64472b]">ماهـين كولكشن</span> 
              علامة مُعتمدة من وزارة التجارة والصناعة في سلطنة عمان، مع شحن لجميع أنحاء العالم.
            </p>

            <p className="leading-loose mb-4">
              كل قطعة تُصمم لتكون فريدة، بخامات فاخرة وقصّات تضمن الراحة
              والأناقة في الوقت نفسه. نؤمن أن الأناقة الحقيقية تبدأ من التفاصيل،
              ولهذا نهتم من أول غرزة خيط وحتى التغليف النهائي الذي يصل إلى بابك.
            </p>

            {/* رؤيتنا */}
            <div className="mt-6 p-5 rounded-xl border border-gray-200">
              <h3 className="text-2xl font-semibold text-[#64472b] mb-3">رؤيتنا</h3>
              <ul className="space-y-2 list-disc pr-5">
                <li>تصاميم تُبرز هوية المرأة العُمانية بأسلوب عصري.</li>
                <li>خامات فاخرة وتجربة ارتداء مريحة.</li>
                <li>وعد بالجمع بين الحشمة والذوق الراقي.</li>
              </ul>
            </div>

            {/* وعدنا */}
            <div className="mt-6 p-5 rounded-xl border border-gray-200">
              <h3 className="text-2xl font-semibold text-[#64472b] mb-3">وعدُنا</h3>
              <ul className="space-y-2 list-disc pr-5">
                <li>أن نقدّم منتجات أصلية بجودة عالية.</li>
                <li>خدمة عملاء مميزة من الطلب حتى الاستلام.</li>
                <li>توصيل محلي ودولي سريع وآمن.</li>
              </ul>
            </div>

            <p className="mt-8 text-lg font-medium text-[#64472b]">
              ماھين كولكشن 🌙 … اسمكِ يزدان بالأناقة.
            </p>
          </div>
        </div>

        {/* لمسة ختامية */}
        <div className="text-center mt-16">
          <p className="text-xl font-semibold text-[#64472b]">
            قطعة واحدة… تحكي قصتك وتُوقّع حضورك بلمسة عمانية أصيلة.
          </p>
        </div>
      </section>
    </div>
  );
};

export default About;
