import React from 'react';
import Icon from '@ant-design/icons';

/*
height='1em'
width='1em'
fill='currentColor'
*/

const TollRoadSvg = () => (
  <svg
    enableBackground='new 0 0 512 512'
    viewBox='0 0 512 512'
    xmlns='http://www.w3.org/2000/svg'
    height='1em'
    width='1em'
    fill='currentColor'
  >
    <path d='m15 241h15v45c0 8.284 6.716 15 15 15s15-6.716 15-15v-45h48.542l-47.287 253.25c-0.818 4.385 0.356 8.906 3.206 12.337s7.079 5.416 11.539 5.416h150c8.284 0 15-6.716 15-15v-256h30v256c0 8.284 6.716 15 15 15h150c4.46 0 8.689-1.985 11.539-5.416s4.024-7.953 3.206-12.337l-47.287-253.25h48.542v45c0 8.284 6.716 15 15 15s15-6.716 15-15v-45h15c8.284 0 15-6.716 15-15s-6.716-15-15-15h-99.143l-37.112-198.75c-1.325-7.1-7.522-12.247-14.745-12.247h-60c-8.284 0-15 6.716-15 15v196h-30v-196c0-8.284-6.716-15-15-15h-60c-7.223 0-13.42 5.147-14.745 12.247l-37.112 198.75h-99.143c-8.284 0-15 6.716-15 15s6.716 15 15 15zm402.94 241h-116.94v-241h71.94zm-116.94-452h32.542l33.796 181h-66.338zm-90 452h-116.94l45-241h71.939zm-32.542-452h32.542v181h-66.338z' />
  </svg>
);

export default function TollRoadIcon(props) {
  return <Icon component={TollRoadSvg} {...props} />;
}
