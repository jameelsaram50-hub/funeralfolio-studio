import 'package:flutter/material.dart';
import 'package:google_fonts/google_fonts.dart';
import '../screens/prayer_cards_screen.dart';
import '../screens/funeral_invitations_screen.dart';
import '../screens/thank_you_cards_screen.dart';
import '../screens/obituary_writer_screen.dart';
import '../screens/orders_screen.dart';
import '../main.dart';

class AppNavbar extends StatelessWidget implements PreferredSizeWidget {
  final String? activeRoute;

  const AppNavbar({super.key, this.activeRoute});

  @override
  Size get preferredSize => const Size.fromHeight(100);

  @override
  Widget build(BuildContext context) {
    final isWide = MediaQuery.of(context).size.width >= 960;
    final canPop = Navigator.canPop(context);

    return Column(
      mainAxisSize: MainAxisSize.min,
      children: [
        // 1. Top Brown Utility Bar (Exact 1:1 with Website)
        Container(
          width: double.infinity,
          height: 32,
          color: const Color(0xFF2C1810),
          padding: const EdgeInsets.symmetric(horizontal: 16),
          child: Row(
            mainAxisAlignment: MainAxisAlignment.spaceBetween,
            children: [
              Row(
                children: [
                  const Icon(Icons.shield_outlined, color: Color(0xFF967440), size: 14),
                  const SizedBox(width: 6),
                  Text(
                    'FuneralFolio — AI Obituary & Memorial Stationery',
                    style: GoogleFonts.inter(
                      fontSize: 11,
                      fontWeight: FontWeight.w600,
                      color: const Color(0xFFD2C2AD),
                    ),
                  ),
                ],
              ),
              if (isWide)
                Row(
                  children: [
                    Text(
                      '300 DPI Print-Ready PDF',
                      style: GoogleFonts.inter(fontSize: 10, color: const Color(0xFFD2C2AD)),
                    ),
                    const SizedBox(width: 14),
                    Text(
                      'Instant Watermarked Preview',
                      style: GoogleFonts.inter(fontSize: 10, color: const Color(0xFFD2C2AD)),
                    ),
                  ],
                ),
            ],
          ),
        ),

        // 2. Main White Navigation Bar
        Container(
          height: 68,
          decoration: BoxDecoration(
            color: Colors.white,
            border: Border(bottom: BorderSide(color: Colors.grey.shade200)),
            boxShadow: [
              BoxShadow(
                color: Colors.black.withValues(alpha: 0.03),
                blurRadius: 10,
                offset: const Offset(0, 2),
              ),
            ],
          ),
          padding: const EdgeInsets.symmetric(horizontal: 16),
          child: Row(
            children: [
              // Back Button if can pop, else Drawer Icon (on Mobile)
              if (canPop)
                IconButton(
                  icon: const Icon(Icons.arrow_back, color: Color(0xFF2C1810)),
                  tooltip: 'Go Back',
                  onPressed: () => Navigator.pop(context),
                )
              else if (!isWide)
                IconButton(
                  icon: const Icon(Icons.menu, color: Color(0xFF2C1810)),
                  tooltip: 'Open Menu',
                  onPressed: () => Scaffold.of(context).openDrawer(),
                ),

              // Logo & Brand
              InkWell(
                onTap: () {
                  Navigator.pushAndRemoveUntil(
                    context,
                    MaterialPageRoute(builder: (context) => const MainAppShell()),
                    (route) => false,
                  );
                },
                child: Row(
                  children: [
                    Container(
                      width: 38,
                      height: 38,
                      decoration: BoxDecoration(
                        color: const Color(0xFF2C1810),
                        borderRadius: BorderRadius.circular(10),
                      ),
                      child: const Icon(Icons.eco, color: Color(0xFFD2C2AD), size: 22),
                    ),
                    const SizedBox(width: 10),
                    Column(
                      crossAxisAlignment: CrossAxisAlignment.start,
                      mainAxisAlignment: MainAxisAlignment.center,
                      children: [
                        Text(
                          'FuneralFolio',
                          style: GoogleFonts.playfairDisplay(
                            fontSize: 20,
                            fontWeight: FontWeight.bold,
                            color: const Color(0xFF2C1810),
                            letterSpacing: -0.5,
                          ),
                        ),
                        Text(
                          'MEMORIAL DOCUMENT PLATFORM',
                          style: GoogleFonts.inter(
                            fontSize: 8,
                            fontWeight: FontWeight.w700,
                            letterSpacing: 1.2,
                            color: const Color(0xFF967440),
                          ),
                        ),
                      ],
                    ),
                  ],
                ),
              ),

              const Spacer(),

              // Desktop Navigation Links
              if (isWide) ...[
                _buildNavLink(context, 'Prayer Cards', '/prayer-cards', const PrayerCardsScreen()),
                _buildNavLink(context, 'Invitations', '/funeral-invitations', const FuneralInvitationsScreen()),
                _buildNavLink(context, 'Thank You', '/thank-you-cards', const ThankYouCardsScreen()),
                _buildNavLink(context, 'AI Obituary', '/obituary-writer', const ObituaryWriterScreen()),
                _buildNavLink(context, 'Orders', '/orders', const OrdersScreen()),
                const SizedBox(width: 16),
              ],

              // CTA Button "AI Obituary"
              ElevatedButton.icon(
                onPressed: () {
                  Navigator.push(
                    context,
                    MaterialPageRoute(builder: (context) => const ObituaryWriterScreen()),
                  );
                },
                style: ElevatedButton.styleFrom(
                  backgroundColor: const Color(0xFF2C1810),
                  foregroundColor: const Color(0xFFF7F5F2),
                  shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(20)),
                  padding: const EdgeInsets.symmetric(horizontal: 16, vertical: 10),
                  elevation: 2,
                ),
                icon: const Icon(Icons.auto_awesome, size: 14, color: Color(0xFF967440)),
                label: Text(
                  'AI Obituary',
                  style: GoogleFonts.inter(fontSize: 12, fontWeight: FontWeight.bold),
                ),
              ),
            ],
          ),
        ),
      ],
    );
  }

  Widget _buildNavLink(BuildContext context, String title, String route, Widget destination) {
    final isCurrent = activeRoute == route;

    return Padding(
      padding: const EdgeInsets.symmetric(horizontal: 8),
      child: TextButton(
        onPressed: () {
          if (!isCurrent) {
            Navigator.push(
              context,
              MaterialPageRoute(builder: (context) => destination),
            );
          }
        },
        style: TextButton.styleFrom(
          foregroundColor: isCurrent ? const Color(0xFF967440) : const Color(0xFF2C1810),
          padding: const EdgeInsets.symmetric(horizontal: 10, vertical: 8),
        ),
        child: Text(
          title,
          style: GoogleFonts.inter(
            fontSize: 12,
            fontWeight: isCurrent ? FontWeight.bold : FontWeight.w600,
            letterSpacing: 0.5,
          ),
        ),
      ),
    );
  }
}

class AppDrawer extends StatelessWidget {
  const AppDrawer({super.key});

  @override
  Widget build(BuildContext context) {
    return Drawer(
      backgroundColor: Colors.white,
      child: ListView(
        padding: EdgeInsets.zero,
        children: [
          DrawerHeader(
            decoration: const BoxDecoration(color: Color(0xFF2C1810)),
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              mainAxisAlignment: MainAxisAlignment.end,
              children: [
                Row(
                  children: [
                    Container(
                      width: 36,
                      height: 36,
                      decoration: BoxDecoration(
                        color: const Color(0xFF967440),
                        borderRadius: BorderRadius.circular(10),
                      ),
                      child: const Icon(Icons.eco, color: Colors.white, size: 22),
                    ),
                    const SizedBox(width: 10),
                    Text(
                      'FuneralFolio',
                      style: GoogleFonts.playfairDisplay(
                        fontSize: 22,
                        fontWeight: FontWeight.bold,
                        color: Colors.white,
                      ),
                    ),
                  ],
                ),
                const SizedBox(height: 6),
                Text(
                  'AI Obituary & Dedicated Memorial Cards',
                  style: GoogleFonts.inter(fontSize: 11, color: const Color(0xFFD2C2AD)),
                ),
              ],
            ),
          ),
          ListTile(
            leading: const Icon(Icons.edit_note, color: Color(0xFF967440)),
            title: Text('AI Obituary Writer', style: GoogleFonts.inter(fontWeight: FontWeight.bold)),
            subtitle: const Text('Guided Life Story Generator'),
            onTap: () {
              Navigator.pop(context);
              Navigator.push(context, MaterialPageRoute(builder: (context) => const ObituaryWriterScreen()));
            },
          ),
          const Divider(),
          ListTile(
            leading: const Icon(Icons.favorite, color: Color(0xFF2C1810)),
            title: Text('Prayer & Keepsake Cards', style: GoogleFonts.inter(fontWeight: FontWeight.w600)),
            subtitle: const Text('2.5" x 4.25" Pocket Cards'),
            onTap: () {
              Navigator.pop(context);
              Navigator.push(context, MaterialPageRoute(builder: (context) => const PrayerCardsScreen()));
            },
          ),
          ListTile(
            leading: const Icon(Icons.mail_outline, color: Color(0xFF2C1810)),
            title: Text('Funeral Invitations', style: GoogleFonts.inter(fontWeight: FontWeight.w600)),
            subtitle: const Text('5" x 7" Service Announcements'),
            onTap: () {
              Navigator.pop(context);
              Navigator.push(context, MaterialPageRoute(builder: (context) => const FuneralInvitationsScreen()));
            },
          ),
          ListTile(
            leading: const Icon(Icons.favorite_border, color: Color(0xFF2C1810)),
            title: Text('Thank You Cards', style: GoogleFonts.inter(fontWeight: FontWeight.w600)),
            subtitle: const Text('4" x 6" Family Gratitude Notes'),
            onTap: () {
              Navigator.pop(context);
              Navigator.push(context, MaterialPageRoute(builder: (context) => const ThankYouCardsScreen()));
            },
          ),
          const Divider(),
          ListTile(
            leading: const Icon(Icons.inventory_2_outlined, color: Color(0xFF2C1810)),
            title: Text('Orders & Tracking', style: GoogleFonts.inter(fontWeight: FontWeight.w600)),
            onTap: () {
              Navigator.pop(context);
              Navigator.push(context, MaterialPageRoute(builder: (context) => const OrdersScreen()));
            },
          ),
        ],
      ),
    );
  }
}
