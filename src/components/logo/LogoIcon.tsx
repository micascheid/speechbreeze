// material-ui
import { useTheme } from '@mui/material/styles';

 const logoIconDark = '/assets/images/logo-icon-dark.svg';
 const logoIcon = '/assets/images/logo-icon.svg';
 import { ThemeMode } from '@/types/config';

 import Image from 'next/image';

// ==============================|| LOGO ICON SVG ||============================== //

const LogoIcon = () => {
  const theme = useTheme();

  return (
     <Image src={theme.palette.mode === ThemeMode.DARK ? logoIconDark : logoIcon} alt="SpeechBreeze" width={35} height={35} />
  );
};

export default LogoIcon;
