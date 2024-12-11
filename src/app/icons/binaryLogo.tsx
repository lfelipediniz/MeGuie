import React from 'react';

interface LogoIconProps {
  width?: number;
  height?: number;
}

const LogoIcon: React.FC<LogoIconProps> = ({
  width = 35,
  height = 35,
}) => {
  return (
<svg width={width} height={height} viewBox="0 0 240 240" fill="none" xmlns="http://www.w3.org/2000/svg" aria-label="Imagem da tela inicial da plataforma: mulher estudando">
<path d="M79.4802 172.655C91.1212 161.077 102.533 149.968 113.64 138.565C118.298 133.784 121.902 133.985 126.563 138.657C145.412 157.549 164.515 176.191 183.498 194.951C184.484 195.926 185.315 197.087 186.071 198.256C189.142 203.004 193.191 208.132 187.06 213.016C181.296 217.607 176.595 213.764 172.417 209.567C160.853 197.953 149.22 186.406 137.755 174.697C132.55 169.381 127.678 163.743 122.463 158.041C105.629 175.429 90.048 191.523 73.9587 208.142C76.048 210.427 79.2941 213.978 82.7213 217.727C91.8538 208.811 100.757 200.29 109.461 191.573C119.112 181.908 120.472 181.934 130.285 191.786C140.693 202.234 151.317 212.468 161.804 222.838C167.637 228.606 167.862 232.17 162.872 237.002C158.353 241.379 154.865 241.065 149.067 235.39C141.538 228.021 134.17 220.49 126.692 213.069C120.841 207.263 118.449 207.286 112.719 213.073C105.307 220.558 98.0012 228.15 90.4688 235.514C84.5423 241.307 81.3929 241.186 75.6213 235.447C67.8192 227.689 60.1626 219.783 52.2292 212.161C47.7033 207.813 47.7011 204.049 52.1865 199.705C61.2688 190.909 70.1587 181.917 79.4802 172.655Z" fill="var(--background)"/>
<path d="M214.999 158.72C213.634 155.125 212.62 151.449 210.314 148.956C203.332 141.408 195.827 134.34 188.567 127.044C183.757 122.211 183.615 117.622 188.737 112.614C200.788 100.83 212.604 88.8067 224.474 76.8396C228.623 72.6563 232.545 72.9476 236.655 76.9228C240.749 80.8832 241.304 84.8198 237.095 89.0018C228.958 97.0872 220.794 105.147 212.688 113.262C207.096 118.859 207.096 120.961 212.682 126.602C220.588 134.587 228.46 142.61 236.525 150.435C241.278 155.046 240.978 158.979 236.284 163.478C228.343 171.09 220.753 179.063 212.925 186.794C207.467 192.185 203.852 192.367 198.526 187.06C178.625 167.235 158.802 147.332 139.071 127.339C133.296 121.487 133.355 119.259 139.238 113.257C158.904 93.1943 178.695 73.2535 198.417 53.2458C202.453 49.1518 206.517 46.7769 211.612 51.8016C216.468 56.5907 216.506 59.7686 210.934 65.4517C195.691 80.9979 180.334 96.4328 165.05 111.939C157.757 119.338 157.862 120.772 165.39 128.36C176.105 139.163 186.789 149.997 197.41 160.892C205.153 168.835 208.067 168.597 214.999 158.72Z" fill="var(--background)"/>
<path d="M51.2492 88.976C47.4696 85.0974 44.0901 81.5215 40.5927 78.0637C34.4269 71.9675 32.0834 72.0776 26.3809 78.5054C24.9847 80.079 23.5341 81.6048 23.3455 81.8095C31.4051 90.7565 39.2864 100.256 47.9781 108.953C57.5943 118.576 57.9113 121.118 48.318 130.526C37.6153 141.021 27.0687 151.674 16.4024 162.206C10.8752 167.664 7.86576 167.869 3.39316 163.343C-1.21511 158.681 -1.26154 154.631 4.0665 149.476C14.3185 139.559 24.8445 129.922 36.066 119.41C26.3111 110.483 18.1317 102.95 9.89866 95.4748C-3.10305 83.6701 -3.12664 83.0999 9.19247 71.0583C15.2221 65.1644 21.0411 59.0438 27.2813 53.3813C31.2351 49.7935 35.6068 48.4358 40.2318 53.1133C62.2991 75.431 84.4873 97.6301 106.613 119.891C107.247 120.529 107.664 121.382 107.967 121.823C85.0836 144.022 62.3885 166.023 39.7156 188.046C35.8094 191.84 32.0421 192.019 28.119 188.062C23.5267 183.43 23.2687 179.632 28.0828 174.735C42.8599 159.702 57.8126 144.84 72.6651 129.88C75.5944 126.929 78.3816 123.839 81.7209 120.297C71.4466 109.736 61.5214 99.534 51.2492 88.976Z" fill="var(--background)"/>
<path d="M53.8306 41.5119C47.3677 34.5697 47.5185 30.7831 53.7848 26.3999C58.676 22.9786 61.9593 25.4874 65.3605 28.8631C80.975 44.3602 96.6344 59.8128 112.329 75.23C119.916 82.6834 120.439 82.645 128.02 75.1184C139.481 63.7412 150.948 52.371 162.347 40.933C167.704 35.5582 167.793 32.634 163.081 27.9835C158.345 23.3091 155.046 23.3366 149.906 28.3961C142.234 35.9478 134.702 43.64 127.052 51.2135C121.181 57.0265 118.558 57.1942 112.934 51.6236C100.962 39.7655 89.1709 27.7264 77.2473 15.8196C73.1085 11.6867 72.1861 7.61724 76.6646 3.11956C81.231 -1.46639 85.3345 -0.217825 89.3957 3.82759C97.1875 11.5892 105.014 19.3158 112.836 27.0474C118.616 32.7604 121.222 32.8909 126.926 27.2861C134.605 19.7409 142.078 11.9897 149.732 4.41875C155.608 -1.39479 158.059 -1.44574 163.85 4.11132C171.448 11.4031 179.012 18.7338 186.449 26.1874C192.048 31.7986 192.217 35.5676 186.626 41.2168C166.87 61.176 147.007 81.0312 127.049 100.79C121.351 106.431 118.505 106.121 112.292 99.9282C92.8973 80.598 73.5483 61.2224 53.8306 41.5119Z" fill="var(--background)"/>
</svg>
  );
}

export default LogoIcon;
