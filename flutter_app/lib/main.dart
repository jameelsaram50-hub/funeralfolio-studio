import 'package:flutter/material.dart';
import 'package:google_fonts/google_fonts.dart';
import 'theme/app_theme.dart';
import 'services/supabase_service.dart';
import 'services/memorial_state_service.dart';
import 'screens/home_screen.dart';
import 'screens/products_hub_screen.dart';
import 'screens/editor_screen.dart';
import 'screens/ai_studio_hub_screen.dart';
import 'screens/orders_screen.dart';
import 'screens/prayer_cards_screen.dart';
import 'screens/funeral_invitations_screen.dart';
import 'screens/thank_you_cards_screen.dart';
import 'screens/template_gallery_screen.dart';
import 'screens/obituary_writer_screen.dart';
import 'screens/checkout_screen.dart';
import 'screens/prayer_card_editor_screen.dart';
import 'screens/invitation_editor_screen.dart';
import 'screens/thank_you_editor_screen.dart';

void main() async {
  WidgetsFlutterBinding.ensureInitialized();
  await SupabaseService.instance.init();
  await MemorialStateService.instance.init();
  runApp(const MemorialLegacyApp());
}

class MemorialLegacyApp extends StatelessWidget {
  const MemorialLegacyApp({super.key});

  @override
  Widget build(BuildContext context) {
    return MaterialApp(
      title: 'FuneralFolio | Memorial Platform',
      debugShowCheckedModeBanner: false,
      theme: AppTheme.lightTheme,
      home: const MainAppShell(),
      routes: {
        '/stationery': (context) => const MainAppShell(initialIndex: 1),
        '/studio': (context) => const MainAppShell(initialIndex: 2),
        '/ai-suite': (context) => const MainAppShell(initialIndex: 3),
        '/prayer-cards': (context) => const PrayerCardsScreen(),
        '/funeral-invitations': (context) => const FuneralInvitationsScreen(),
        '/thank-you-cards': (context) => const ThankYouCardsScreen(),
        '/gallery': (context) => const TemplateGalleryScreen(),
        '/obituary-writer': (context) => const ObituaryWriterScreen(),
        '/orders': (context) => const OrdersScreen(),
        '/checkout': (context) => const CheckoutScreen(),
        '/editor': (context) => const EditorScreen(),
        '/editor/prayer': (context) => const PrayerCardEditorScreen(),
        '/editor/invitation': (context) => const InvitationEditorScreen(),
        '/editor/thank-you': (context) => const ThankYouEditorScreen(),
      },
    );
  }
}

class MainAppShell extends StatefulWidget {
  final int initialIndex;
  const MainAppShell({super.key, this.initialIndex = 0});

  @override
  State<MainAppShell> createState() => _MainAppShellState();
}

class _MainAppShellState extends State<MainAppShell> {
  late int _currentIndex;

  @override
  void initState() {
    super.initState();
    _currentIndex = widget.initialIndex;
  }

  void _onNavigateTab(int index) {
    setState(() => _currentIndex = index);
  }

  @override
  Widget build(BuildContext context) {
    final screens = [
      HomeScreen(onNavigateTab: _onNavigateTab),
      const ProductsHubScreen(),
      const EditorScreen(),
      const AiStudioHubScreen(),
      const OrdersScreen(),
    ];

    return Scaffold(
      body: IndexedStack(
        index: _currentIndex,
        children: screens,
      ),
      bottomNavigationBar: Container(
        decoration: BoxDecoration(
          color: Colors.white,
          border: const Border(top: BorderSide(color: Color(0xFFE2E8F0), width: 1)),
          boxShadow: [
            BoxShadow(
              color: const Color(0xFF2C1810).withValues(alpha: 0.05),
              blurRadius: 16,
              offset: const Offset(0, -4),
            ),
          ],
        ),
        child: SafeArea(
          child: Padding(
            padding: const EdgeInsets.symmetric(horizontal: 8, vertical: 6),
            child: Row(
              mainAxisAlignment: MainAxisAlignment.spaceAround,
              children: [
                _buildNavItem(0, Icons.home_outlined, Icons.home, 'Home'),
                _buildNavItem(1, Icons.menu_book_outlined, Icons.menu_book, 'Stationery'),
                _buildNavItem(2, Icons.brush_outlined, Icons.brush, 'Studio'),
                _buildNavItem(3, Icons.auto_awesome_outlined, Icons.auto_awesome, 'AI Suite'),
                _buildNavItem(4, Icons.inventory_2_outlined, Icons.inventory_2, 'Orders'),
              ],
            ),
          ),
        ),
      ),
    );
  }

  Widget _buildNavItem(int index, IconData icon, IconData activeIcon, String label) {
    final isSelected = _currentIndex == index;

    return InkWell(
      onTap: () => setState(() => _currentIndex = index),
      borderRadius: BorderRadius.circular(16),
      child: AnimatedContainer(
        duration: const Duration(milliseconds: 200),
        padding: const EdgeInsets.symmetric(horizontal: 14, vertical: 8),
        decoration: BoxDecoration(
          color: isSelected ? const Color(0xFF967440).withValues(alpha: 0.12) : Colors.transparent,
          borderRadius: BorderRadius.circular(16),
        ),
        child: Column(
          mainAxisSize: MainAxisSize.min,
          children: [
            Icon(
              isSelected ? activeIcon : icon,
              color: isSelected ? const Color(0xFF967440) : const Color(0xFF64748B),
              size: 22,
            ),
            const SizedBox(height: 3),
            Text(
              label,
              style: GoogleFonts.inter(
                fontSize: 10,
                fontWeight: isSelected ? FontWeight.bold : FontWeight.w500,
                color: isSelected ? const Color(0xFF967440) : const Color(0xFF64748B),
              ),
            ),
          ],
        ),
      ),
    );
  }
}
