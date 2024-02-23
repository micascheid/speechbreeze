// material-ui
import { useTheme } from '@mui/material/styles';

 const logoIconDark = '/assets/images/logo-icon-dark.svg';
 const logoIcon = '/assets/images/logo-icon.svg';
 import { ThemeMode } from '@/types/config';

 import Image from 'next/image';

// ==============================|| LOGO ICON SVG ||============================== //

const LogoIcon = ({width = 35, height = 35} : {width?: number, height?: number}) => {
  const theme = useTheme();

  return (
     <Image src={theme.palette.mode === ThemeMode.DARK ? logoIconDark : logoIcon} alt="SpeechBreeze" width={width} height={height} />
  );
};

export default LogoIcon;
