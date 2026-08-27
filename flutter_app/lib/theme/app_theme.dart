import 'package:flutter/material.dart';
import 'package:google_fonts/google_fonts.dart';

class MemorialThemeConfig {
  final String id;
  final String name;
  final String subtitle;
  final Color primaryColor;
  final Color accentColor;
  final Color accentLight;
  final Color bgColor;
  final Color cardBg;
  final Color textColor;
  final Color textMuted;
  final Color borderColor;
  final bool isDark;

  const MemorialThemeConfig({
    required this.id,
    required this.name,
    required this.subtitle,
    required this.primaryColor,
    required this.accentColor,
    required this.accentLight,
    required this.bgColor,
    required this.cardBg,
    required this.textColor,
    required this.textMuted,
    required this.borderColor,
    this.isDark = false,
  });

  String get tagline => subtitle;
}

class MemorialThemes {
  static const MemorialThemeConfig celestialGold = MemorialThemeConfig(
    id: 'celestial-gold',
    name: 'Celestial Gold',
    subtitle: 'Warm Bronze & Slate',
    primaryColor: Color(0xFF1E293B),
    accentColor: Color(0xFF967440),
    accentLight: Color(0xFFC5A880),
    bgColor: Color(0xFFFBF9F5),
    cardBg: Colors.white,
    textColor: Color(0xFF1E293B),
    textMuted: Color(0xFF64748B),
    borderColor: Color(0xFFD4AF37),
    isDark: false,
  );

  static const MemorialThemeConfig serenitySage = MemorialThemeConfig(
    id: 'serenity-sage',
    name: 'Botanical Sage',
    subtitle: 'Calming Eucalyptus Green',
    primaryColor: Color(0xFF1C2E24),
    accentColor: Color(0xFF3D6352),
    accentLight: Color(0xFF7DA291),
    bgColor: Color(0xFFF4F7F4),
    cardBg: Colors.white,
    textColor: Color(0xFF1C2E24),
    textMuted: Color(0xFF526D60),
    borderColor: Color(0xFF5A8270),
    isDark: false,
  );

  static const MemorialThemeConfig midnightElegance = MemorialThemeConfig(
    id: 'midnight-elegance',
    name: 'Midnight Silver',
    subtitle: 'Deep Obsidian & Silver',
    primaryColor: Color(0xFF0F172A),
    accentColor: Color(0xFFCBD5E1),
    accentLight: Color(0xFF94A3B8),
    bgColor: Color(0xFF0B0F19),
    cardBg: Color(0xFF1E293B),
    textColor: Color(0xFFF8FAFC),
    textMuted: Color(0xFF94A3B8),
    borderColor: Color(0xFF64748B),
    isDark: true,
  );

  static const MemorialThemeConfig roseHeritage = MemorialThemeConfig(
    id: 'rose-heritage',
    name: 'Rose Floral',
    subtitle: 'Blush & Crimson Rose',
    primaryColor: Color(0xFF4C1D2A),
    accentColor: Color(0xFF9F1239),
    accentLight: Color(0xFFFB7185),
    bgColor: Color(0xFFFFF5F5),
    cardBg: Colors.white,
    textColor: Color(0xFF4C1D2A),
    textMuted: Color(0xFF884D5E),
    borderColor: Color(0xFFE11D48),
    isDark: false,
  );

  static const MemorialThemeConfig oceanHorizon = MemorialThemeConfig(
    id: 'ocean-horizon',
    name: 'Ocean Serenity',
    subtitle: 'Coastal Blue & Sky',
    primaryColor: Color(0xFF0C4A6E),
    accentColor: Color(0xFF0284C7),
    accentLight: Color(0xFF38BDF8),
    bgColor: Color(0xFFF0F9FF),
    cardBg: Colors.white,
    textColor: Color(0xFF0C4A6E),
    textMuted: Color(0xFF476D85),
    borderColor: Color(0xFF0EA5E9),
    isDark: false,
  );

  static const List<MemorialThemeConfig> allThemes = [
    celestialGold,
    serenitySage,
    midnightElegance,
    roseHeritage,
    oceanHorizon,
  ];

  static List<MemorialThemeConfig> get all => allThemes;

  static MemorialThemeConfig getById(String? id) {
    return allThemes.firstWhere(
      (t) => t.id == id,
      orElse: () => celestialGold,
    );
  }
}

class AppColors {
  static const Color primary = Color(0xFF1E293B);
  static const Color primaryLight = Color(0xFF334155);
  static const Color accent = Color(0xFF967440);
  static const Color accentLight = Color(0xFFC5A880);
  static const Color bgMain = Color(0xFFFBF9F5);
  static const Color bgSurface = Color(0xFFF3EFEA);
  static const Color cardBg = Colors.white;
  static const Color textDark = Color(0xFF1E293B);
  static const Color textMuted = Color(0xFF64748B);
  static const Color candleGold = Color(0xFFF59E0B);
  static const Color borderSubtle = Color(0xFFE2DCD5);
}

class AppTheme {
  static ThemeData get lightTheme {
    return ThemeData(
      useMaterial3: true,
      scaffoldBackgroundColor: AppColors.bgMain,
      colorScheme: ColorScheme.light(
        primary: AppColors.primary,
        secondary: AppColors.accent,
        surface: AppColors.cardBg,
        onPrimary: Colors.white,
        onSecondary: Colors.white,
        onSurface: AppColors.textDark,
      ),
      textTheme: TextTheme(
        displayLarge: GoogleFonts.playfairDisplay(
          fontSize: 32,
          fontWeight: FontWeight.bold,
          color: AppColors.textDark,
          letterSpacing: -0.5,
        ),
        displayMedium: GoogleFonts.playfairDisplay(
          fontSize: 26,
          fontWeight: FontWeight.bold,
          color: AppColors.textDark,
        ),
        displaySmall: GoogleFonts.playfairDisplay(
          fontSize: 20,
          fontWeight: FontWeight.w600,
          color: AppColors.textDark,
        ),
        headlineMedium: GoogleFonts.playfairDisplay(
          fontSize: 18,
          fontWeight: FontWeight.w600,
          color: AppColors.textDark,
        ),
        titleMedium: GoogleFonts.inter(
          fontSize: 16,
          fontWeight: FontWeight.w600,
          color: AppColors.textDark,
        ),
        bodyLarge: GoogleFonts.inter(
          fontSize: 15,
          color: AppColors.textDark,
          height: 1.5,
        ),
        bodyMedium: GoogleFonts.inter(
          fontSize: 14,
          color: AppColors.textMuted,
          height: 1.4,
        ),
        labelLarge: GoogleFonts.inter(
          fontSize: 13,
          fontWeight: FontWeight.bold,
          letterSpacing: 0.5,
        ),
      ),
      appBarTheme: AppBarTheme(
        backgroundColor: AppColors.bgMain,
        elevation: 0,
        centerTitle: true,
        iconTheme: const IconThemeData(color: AppColors.textDark),
        titleTextStyle: GoogleFonts.playfairDisplay(
          fontSize: 20,
          fontWeight: FontWeight.bold,
          color: AppColors.textDark,
        ),
      ),
      cardTheme: CardThemeData(
        color: AppColors.cardBg,
        elevation: 2,
        shadowColor: Colors.black.withValues(alpha: 0.04),
        shape: RoundedRectangleBorder(
          borderRadius: BorderRadius.circular(24),
          side: const BorderSide(color: AppColors.borderSubtle, width: 0.8),
        ),
      ),
      elevatedButtonTheme: ElevatedButtonThemeData(
        style: ElevatedButton.styleFrom(
          backgroundColor: AppColors.primary,
          foregroundColor: Colors.white,
          elevation: 0,
          padding: const EdgeInsets.symmetric(horizontal: 24, vertical: 16),
          shape: RoundedRectangleBorder(
            borderRadius: BorderRadius.circular(20),
          ),
          textStyle: GoogleFonts.inter(
            fontSize: 15,
            fontWeight: FontWeight.w600,
          ),
        ),
      ),
      inputDecorationTheme: InputDecorationTheme(
        filled: true,
        fillColor: AppColors.bgSurface,
        border: OutlineInputBorder(
          borderRadius: BorderRadius.circular(16),
          borderSide: BorderSide.none,
        ),
        focusedBorder: OutlineInputBorder(
          borderRadius: BorderRadius.circular(16),
          borderSide: const BorderSide(color: AppColors.accent, width: 1.5),
        ),
        contentPadding: const EdgeInsets.symmetric(horizontal: 20, vertical: 16),
      ),
    );
  }
}
