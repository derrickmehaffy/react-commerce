import * as React from 'react';

function SvgVive(props: React.SVGProps<SVGSVGElement>) {
   return (
      <svg
         width={96}
         height={64}
         fill="none"
         xmlns="http://www.w3.org/2000/svg"
         {...props}
      >
         <g clipPath="url(#vive_svg__clip0_104_5533)">
            <path
               d="M24.65 23.662a1.328 1.328 0 00-1.15-.66h-2.618a1.33 1.33 0 00-1.15.666l-7.555 13.066c-.238.41-.238.917 0 1.328l1.312 2.27c.235.41.676.666 1.15.666h15.1a1.33 1.33 0 001.151-.663l1.312-2.273c.235-.41.235-.918 0-1.328L24.65 23.662zm1.14 14.33a12.02 12.02 0 01-7.209 0 2.718 2.718 0 01-1.865-3.127 11.934 11.934 0 013.604-6.337 2.735 2.735 0 013.706 0 11.952 11.952 0 013.604 6.337 2.714 2.714 0 01-1.863 3.13h.022v-.003z"
               fill="#00B3E3"
            />
            <path
               d="M70.904 28.24l-4.56 8.973a.434.434 0 01-.386.236H64.45a.434.434 0 01-.386-.236l-4.56-8.974a.511.511 0 010-.474l.488-.831a.533.533 0 01.46-.278h.444c.116 0 .224.064.277.17l3.834 7.626c.055.108.188.15.296.092a.208.208 0 00.092-.092l3.834-7.626a.3.3 0 01.277-.17h.441c.191 0 .369.109.46.278l.48.831a.49.49 0 010 .472M48.31 28.24l-4.564 8.973a.434.434 0 01-.386.236h-1.502a.433.433 0 01-.385-.236l-4.566-8.974a.512.512 0 010-.474l.485-.831a.527.527 0 01.457-.264h.444a.3.3 0 01.277.17l3.834 7.626c.055.108.189.15.297.091a.209.209 0 00.091-.091l3.834-7.627a.3.3 0 01.278-.169h.44c.189 0 .364.1.458.264l.48.845a.498.498 0 01.013.471M54.84 26.784a.436.436 0 00-.31-.128h-.682a.524.524 0 00-.46.278l-.485.831a.484.484 0 00-.067.247v8.999c0 .241.197.438.438.438h1.259a.434.434 0 00.435-.435v-9.922a.434.434 0 00-.13-.31M75.996 26.92a.527.527 0 01.458-.264h6.534c.186 0 .358.097.452.258l.46.79c.067.114.1.244.1.374v.197a.297.297 0 01-.297.297h-5.966a.218.218 0 00-.219.219v2.068c0 .122.097.22.22.22h4.039a.36.36 0 01.355.357v1.186a.36.36 0 01-.358.358h-4.037a.218.218 0 00-.219.219v2.126c0 .122.097.22.22.22h5.957c.164 0 .294.13.297.293v.2c0 .13-.034.26-.1.374l-.46.79a.515.515 0 01-.45.258h-6.531a.527.527 0 01-.457-.263l-.455-.785a.742.742 0 01-.1-.374V28.08c0-.13.033-.26.1-.374l.457-.787z"
               fill="#2C3A50"
            />
         </g>
         <defs>
            <clipPath id="vive_svg__clip0_104_5533">
               <path
                  fill="#fff"
                  transform="translate(12 23.002)"
                  d="M0 0h72v17.995H0z"
               />
            </clipPath>
         </defs>
      </svg>
   );
}

export default SvgVive;