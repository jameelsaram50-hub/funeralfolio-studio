import 'package:flutter/material.dart';
import 'package:google_fonts/google_fonts.dart';
import '../screens/prayer_cards_screen.dart';
import '../screens/funeral_invitations_screen.dart';
import '../screens/thank_you_cards_screen.dart';
import '../screens/obituary_writer_screen.dart';
import '../screens/orders_screen.dart';

class AppFooter extends StatelessWidget {
  const AppFooter({super.key});

  @override
  Widget build(BuildContext context) {
    return Container(
      width: double.infinity,
      color: const Color(0xFF2C1810),
      padding: const EdgeInsets.symmetric(horizontal: 24, vertical: 36),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          // Logo & Brand
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
          const SizedBox(height: 10),
          Text(
            'A dedicated AI obituary and memorial stationery platform. Create personalized prayer cards, ceremony invitations, thank you cards, and heartfelt AI obituaries with ease and dignity.',
            style: GoogleFonts.inter(
              fontSize: 12,
              color: const Color(0xFFD2C2AD),
              height: 1.5,
            ),
          ),
          const SizedBox(height: 14),

          // Security badges
          Row(
            children: [
              const Icon(Icons.verified_outlined, size: 14, color: Color(0xFF967440)),
              const SizedBox(width: 6),
              Flexible(
                child: Text(
                  '300 DPI High-Resolution Print-Ready PDF Downloads',
                  style: GoogleFonts.inter(fontSize: 10, color: Colors.white70),
                ),
              ),
            ],
          ),
          const SizedBox(height: 6),
          Row(
            children: [
              const Icon(Icons.lock_outline, size: 14, color: Color(0xFF967440)),
              const SizedBox(width: 6),
              Flexible(
                child: Text(
                  'Stripe Encrypted & Secure Checkout Protection',
                  style: GoogleFonts.inter(fontSize: 10, color: Colors.white70),
                ),
              ),
            ],
          ),

          const SizedBox(height: 24),
          const Divider(color: Colors.white12),
          const SizedBox(height: 16),

          // Stationery Links
          Text(
            'MEMORIAL STATIONERY',
            style: GoogleFonts.inter(fontSize: 11, fontWeight: FontWeight.bold, color: const Color(0xFF967440), letterSpacing: 1.2),
          ),
          const SizedBox(height: 10),
          _buildFooterLink(context, '• Prayer & Keepsake Cards', const PrayerCardsScreen()),
          _buildFooterLink(context, '• Funeral Invitations', const FuneralInvitationsScreen()),
          _buildFooterLink(context, '• Thank You Cards', const ThankYouCardsScreen()),

          const SizedBox(height: 20),

          // AI Writing Links
          Text(
            'AI OBITUARY',
            style: GoogleFonts.inter(fontSize: 11, fontWeight: FontWeight.bold, color: const Color(0xFF967440), letterSpacing: 1.2),
          ),
          const SizedBox(height: 10),
          _buildFooterLink(context, '• AI Obituary Writer', const ObituaryWriterScreen()),
          _buildFooterLink(context, '• Orders & Tracking', const OrdersScreen()),

          const SizedBox(height: 24),
          const Divider(color: Colors.white12),
          const SizedBox(height: 12),

          Text(
            '© 2026 FuneralFolio Memorial Document Platform. All rights reserved.',
            style: GoogleFonts.inter(fontSize: 10, color: Colors.white38),
          ),
        ],
      ),
    );
  }

  Widget _buildFooterLink(BuildContext context, String text, Widget destination) {
    return Padding(
      padding: const EdgeInsets.only(bottom: 6),
      child: InkWell(
        onTap: () {
          Navigator.push(
            context,
            MaterialPageRoute(builder: (context) => destination),
          );
        },
        child: Text(
          text,
          style: GoogleFonts.inter(fontSize: 11, color: const Color(0xFFD2C2AD)),
        ),
      ),
    );
  }
}
