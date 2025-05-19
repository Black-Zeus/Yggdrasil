// src/components/atoms/iconMap.js
import {
  // 📁 NAVEGACIÓN
  RiDashboardLine, RiFileListLine, RiLayoutLine, RiBarChartBoxLine, RiPieChartLine, RiBarChart2Line,
  RiArrowDownSLine, RiArrowRightSLine, RiArrowLeftSLine, RiArrowLeftRightLine, RiHome6Line,

  // 🧩 MÓDULOS FUNCIONALES
  RiFileTextLine, RiFileChartLine, RiLineChartLine, RiFileDownloadLine, RiEditLine,
  RiRecycleLine, RiFileList3Line, RiFileCopy2Line, RiFileWarningLine, RiBox3Line, RiBarcodeBoxLine,

  // 🛒 VENTAS / COMERCIO
  RiShoppingBagLine, RiLoopLeftLine, RiRefund2Line, RiMoneyDollarCircleLine, RiPriceTag3Line,

  // 🔧 CONFIGURACIÓN / AJUSTES
  RiSettings3Line, RiToolsLine, RiUserSettingsLine, RiSettings4Line, RiAdminLine,
  RiRefreshLine, RiExternalLinkLine, RiFilterLine, RiDeleteBin6Line, RiSortDesc, RiUploadCloud2Line,

  // 👤 USUARIOS / SEGURIDAD
  RiUserLine, RiLockLine, RiLockUnlockLine, RiShieldLine, RiShieldCheckLine, RiMobileDownloadLine,

  // 🔔 ALERTAS / SOPORTE
  RiNotificationLine, RiQuestionLine, RiBellLine, RiCustomerServiceLine, RiErrorWarningLine,

  // 📚 AYUDA / MULTIMEDIA
  RiBookOpenLine, RiVideoLine, RiFilePaperLine, RiInformationLine, RiHistoryLine, RiQuoteText,

  // 📦 DATOS / SISTEMA
  RiDatabase2Line, RiHardDriveLine, RiArchiveLine, RiSmartphoneLine, RiComputerLine,
  RiQrCodeLine, RiDownloadLine, RiCheckboxFill,

  // 🌐 RED / WEB
  RiWifiLine, RiGlobeLine,

  // 🧭 UI / INTERFAZ
  RiEyeLine, RiEyeOffLine, RiCloseLine, RiAddLine, RiAddCircleLine,
  RiThumbUpLine, RiThumbDownLine, RiAlignLeft, RiFontSize,
  RiListUnordered, RiGridLine, RiSlideshowLine, RiSearchLine,
  RiArrowUpDownLine, RiDragMoveLine, 

  // 🚚 MISCELÁNEOS
  RiCodeLine, RiDeviceLine, RiShareLine, RiExchangeLine, RiTruckLine, RiExpandDiagonalLine, RiDownload2Line, 
  RiArrowLeftUpBoxFill, RiArrowLeftDownBoxFill, RiClipboardLine, RiCheckboxCircleLine, RiEdit2Line, 
  RiDeleteBinLine, RiCloseCircleLine, RiSave3Line, RiPlayCircleLine, RiTimeLine, RiChat1Line, RiMailLine, RiPhoneLine,
  RiSunLine, RiMoonLine, RiLogoutBoxRLine
} from "react-icons/ri";

/**
 * Mapa centralizado de iconos para la aplicación
 * Usar strings como claves para acceder a los componentes de iconos
 */
export const iconMap = {
  // Navegación principal
  "dashboard": RiDashboardLine,
  "home": RiHome6Line,
  "layout": RiLayoutLine,
  "file-list": RiFileListLine,
  "chart-bar": RiBarChartBoxLine,
  "chart-pie": RiPieChartLine,
  "chart-bar-2": RiBarChart2Line,
  "chart-line": RiLineChartLine,
  
  // Acciones y navegación
  "arrow-down": RiArrowDownSLine,
  "arrow-right": RiArrowRightSLine,
  "arrow-left": RiArrowLeftSLine,
  "arrow-left-right": RiArrowLeftRightLine,
  "arrow-up-down": RiArrowUpDownLine,
  "arrow-left-up-box": RiArrowLeftUpBoxFill,
  "arrow-left-down-box": RiArrowLeftDownBoxFill,
  
  // Documentos y archivos
  "file-text": RiFileTextLine,
  "file-chart": RiFileChartLine,
  "file-download": RiFileDownloadLine,
  "file-list-3": RiFileList3Line,
  "file-copy": RiFileCopy2Line,
  "file-warning": RiFileWarningLine,
  "file-paper": RiFilePaperLine,
  
  // Edición y gestión
  "edit": RiEditLine,
  "edit-2": RiEdit2Line,
  "recycle": RiRecycleLine,
  "clipboard": RiClipboardLine,
  "save": RiSave3Line,
  
  // Elementos de comercio
  "shopping-bag": RiShoppingBagLine,
  "loop-left": RiLoopLeftLine,
  "refund": RiRefund2Line,
  "money": RiMoneyDollarCircleLine,
  "price-tag": RiPriceTag3Line,
  
  // Configuración y ajustes
  "settings": RiSettings3Line,
  "settings-user": RiUserSettingsLine,
  "settings-4": RiSettings4Line,
  "tools": RiToolsLine,
  "admin": RiAdminLine,
  "refresh": RiRefreshLine,
  "external-link": RiExternalLinkLine,
  "filter": RiFilterLine,
  
  // Usuarios y seguridad
  "user": RiUserLine,
  "lock": RiLockLine,
  "unlock": RiLockUnlockLine,
  "shield": RiShieldLine,
  "shield-check": RiShieldCheckLine,
  "mobile-download": RiMobileDownloadLine,
  
  // Notificaciones y alertas
  "notification": RiNotificationLine,
  "bell": RiBellLine,
  "question": RiQuestionLine,
  "customer-service": RiCustomerServiceLine,
  "warning": RiErrorWarningLine,
  
  // Contenido multimedia
  "book-open": RiBookOpenLine,
  "video": RiVideoLine,
  "information": RiInformationLine,
  "history": RiHistoryLine,
  "quote": RiQuoteText,
  
  // Datos y sistema
  "database": RiDatabase2Line,
  "hard-drive": RiHardDriveLine,
  "archive": RiArchiveLine,
  "smartphone": RiSmartphoneLine,
  "computer": RiComputerLine,
  "qr-code": RiQrCodeLine,
  "download": RiDownloadLine,
  "download-2": RiDownload2Line,
  "checkbox": RiCheckboxFill,
  "checkbox-circle": RiCheckboxCircleLine,
  
  // Red y conexión
  "wifi": RiWifiLine,
  "globe": RiGlobeLine,
  
  // Interfaz de usuario
  "eye": RiEyeLine,
  "eye-off": RiEyeOffLine,
  "close": RiCloseLine,
  "close-circle": RiCloseCircleLine,
  "add": RiAddLine,
  "add-circle": RiAddCircleLine,
  "thumb-up": RiThumbUpLine,
  "thumb-down": RiThumbDownLine,
  "align-left": RiAlignLeft,
  "font-size": RiFontSize,
  "list": RiListUnordered,
  "grid": RiGridLine,
  "slideshow": RiSlideshowLine,
  "search": RiSearchLine,
  "drag-move": RiDragMoveLine,
  "delete": RiDeleteBinLine,
  "delete-bin": RiDeleteBin6Line,
  "sort-desc": RiSortDesc,
  
  // Misceláneos
  "code": RiCodeLine,
  "device": RiDeviceLine,
  "share": RiShareLine,
  "exchange": RiExchangeLine,
  "truck": RiTruckLine,
  "expand": RiExpandDiagonalLine,
  "play-circle": RiPlayCircleLine,
  "time": RiTimeLine,
  "chat": RiChat1Line,
  "mail": RiMailLine,
  "phone": RiPhoneLine,
  "box": RiBox3Line,
  "barcode-box": RiBarcodeBoxLine,
  "upload-cloud": RiUploadCloud2Line,
  
  // Tema
  "sun": RiSunLine,
  "moon": RiMoonLine,
  "logout": RiLogoutBoxRLine
};