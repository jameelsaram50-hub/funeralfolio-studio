import 'package:flutter/material.dart';
import 'package:google_fonts/google_fonts.dart';
import '../theme/app_theme.dart';
import '../services/memorial_state_service.dart';
import 'prayer_cards_screen.dart';
import 'funeral_invitations_screen.dart';
import 'thank_you_cards_screen.dart';
import 'template_gallery_screen.dart';
import 'prayer_card_editor_screen.dart';
import 'invitation_editor_screen.dart';
import 'thank_you_editor_screen.dart';

class ProductsHubScreen extends StatelessWidget {
  const ProductsHubScreen({super.key});

  @override
  Widget build(BuildContext context) {
    final activeDraft = MemorialStateService.instance.activeMemorial;

    final List<Map<String, dynamic>> products = [
      {
        'id': 'cards',
        'title': 'Prayer & Keepsake Cards',
        'badge': 'Cherished Keepsake',
        'dimensions': '2.5" x 4.25" Pocket Size',
        'desc': 'Pocket-sized remembrance cards with portrait, gold filigree border, and chosen scripture (Psalm 23, Irish Blessing).',
        'icon': Icons.favorite,
        'color': const Color(0xFF9F1239),
        'screen': const PrayerCardsScreen(),
        'editorType': 'cards',
      },
      {
        'id': 'invitation',
        'title': 'Funeral Invitations',
        'badge': 'Announcements',
        'dimensions': '5" x 7" Service Announcement',
        'desc': 'Elegant celebration of life announcements with ceremony chapel location, date, time, and reception details.',
        'icon': Icons.mail_outline,
        'color': const Color(0xFF1E3A8A),
        'screen': const FuneralInvitationsScreen(),
        'editorType': 'invitation',
      },
      {
        'id': 'thank-you',
        'title': 'Thank You Cards',
        'badge': 'Family Gratitude',
        'dimensions': '4" x 6" Note Card',
        'desc': 'Heartfelt bereavement acknowledgment notes expressing deep gratitude for flowers, prayers, and condolences.',
        'icon': Icons.favorite_border,
        'color': const Color(0xFF047857),
        'screen': const ThankYouCardsScreen(),
        'editorType': 'thank-you',
      },
    ];

    return Scaffold(
      backgroundColor: AppColors.bgMain,
      appBar: AppBar(
        title: Text(
          'Stationery Product Catalog',
          style: GoogleFonts.playfairDisplay(fontWeight: FontWeight.bold),
        ),
        actions: [
          IconButton(
            icon: const Icon(Icons.style_outlined, color: AppColors.primary),
            tooltip: 'Browse All Templates',
            onPressed: () {
              Navigator.push(
                context,
                MaterialPageRoute(builder: (context) => const TemplateGalleryScreen()),
              );
            },
          ),
        ],
      ),
      body: SingleChildScrollView(
        padding: const EdgeInsets.symmetric(horizontal: 20, vertical: 16),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            // Guided creation promo banner
            Container(
              padding: const EdgeInsets.all(20),
              decoration: BoxDecoration(
                gradient: const LinearGradient(
                  colors: [AppColors.primary, Color(0xFF0F172A)],
                  begin: Alignment.topLeft,
                  end: Alignment.bottomRight,
                ),
                borderRadius: BorderRadius.circular(20),
                boxShadow: [
                  BoxShadow(
                    color: AppColors.primary.withValues(alpha: 0.18),
                    blurRadius: 16,
                    offset: const Offset(0, 6),
                  ),
                ],
              ),
              child: Row(
                children: [
                  Expanded(
                    child: Column(
                      crossAxisAlignment: CrossAxisAlignment.start,
                      children: [
                        Container(
                          padding: const EdgeInsets.symmetric(horizontal: 10, vertical: 4),
                          decoration: BoxDecoration(
                            color: AppColors.accent.withValues(alpha: 0.25),
                            borderRadius: BorderRadius.circular(12),
                          ),
                          child: Text(
                            'GUIDED STEP-BY-STEP QUIZ',
                            style: GoogleFonts.inter(
                              fontSize: 10,
                              fontWeight: FontWeight.bold,
                              color: AppColors.accent,
                              letterSpacing: 1.2,
                            ),
                          ),
                        ),
                        const SizedBox(height: 10),
                        Text(
                          'Coordinated Memorial Collection',
                          style: GoogleFonts.playfairDisplay(
                            fontSize: 16,
                            fontWeight: FontWeight.bold,
                            color: Colors.white,
                          ),
                        ),
                        const SizedBox(height: 4),
                        Text(
                          'Explore 100+ beautifully matched templates across programs, prayer cards, invitations, and thank you notes.',
                          style: GoogleFonts.inter(fontSize: 12, color: Colors.white70),
                        ),
                      ],
                    ),
                  ),
                  const SizedBox(width: 14),
                  ElevatedButton(
                    onPressed: () {
                      Navigator.push(
                        context,
                        MaterialPageRoute(builder: (context) => const TemplateGalleryScreen()),
                      );
                    },
                    style: ElevatedButton.styleFrom(
                      backgroundColor: AppColors.accent,
                      foregroundColor: AppColors.primary,
                      shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(12)),
                      padding: const EdgeInsets.symmetric(horizontal: 16, vertical: 12),
                    ),
                    child: Text(
                      'Browse',
                      style: GoogleFonts.inter(fontWeight: FontWeight.bold, fontSize: 12),
                    ),
                  ),
                ],
              ),
            ),

            const SizedBox(height: 24),

            Text(
              'Select a Stationery Format to Customize',
              style: GoogleFonts.playfairDisplay(
                fontSize: 20,
                fontWeight: FontWeight.bold,
                color: AppColors.textDark,
              ),
            ),
            const SizedBox(height: 4),
            Text(
              'All details entered for "${activeDraft.name}" automatically carry over to every design.',
              style: GoogleFonts.inter(fontSize: 13, color: AppColors.textMuted),
            ),
            const SizedBox(height: 16),

            // Product Cards List
            ListView.separated(
              shrinkWrap: true,
              physics: const NeverScrollableScrollPhysics(),
              itemCount: products.length,
              separatorBuilder: (context, index) => const SizedBox(height: 14),
              itemBuilder: (context, index) {
                final p = products[index];
                return Container(
                  padding: const EdgeInsets.all(18),
                  decoration: BoxDecoration(
                    color: Colors.white,
                    borderRadius: BorderRadius.circular(20),
                    border: Border.all(color: AppColors.borderSubtle),
                    boxShadow: [
                      BoxShadow(
                        color: Colors.black.withValues(alpha: 0.03),
                        blurRadius: 12,
                        offset: const Offset(0, 4),
                      ),
                    ],
                  ),
                  child: Column(
                    crossAxisAlignment: CrossAxisAlignment.start,
                    children: [
                      Row(
                        crossAxisAlignment: CrossAxisAlignment.start,
                        children: [
                          Container(
                            padding: const EdgeInsets.all(12),
                            decoration: BoxDecoration(
                              color: (p['color'] as Color).withValues(alpha: 0.12),
                              borderRadius: BorderRadius.circular(16),
                            ),
                            child: Icon(p['icon'] as IconData, color: p['color'] as Color, size: 28),
                          ),
                          const SizedBox(width: 14),
                          Expanded(
                            child: Column(
                              crossAxisAlignment: CrossAxisAlignment.start,
                              children: [
                                Row(
                                  children: [
                                    Expanded(
                                      child: Text(
                                        p['title'] as String,
                                        style: GoogleFonts.playfairDisplay(
                                          fontSize: 18,
                                          fontWeight: FontWeight.bold,
                                          color: AppColors.textDark,
                                        ),
                                      ),
                                    ),
                                    Container(
                                      padding: const EdgeInsets.symmetric(horizontal: 8, vertical: 3),
                                      decoration: BoxDecoration(
                                        color: AppColors.bgSurface,
                                        borderRadius: BorderRadius.circular(8),
                                      ),
                                      child: Text(
                                        p['badge'] as String,
                                        style: GoogleFonts.inter(
                                          fontSize: 10,
                                          fontWeight: FontWeight.bold,
                                          color: AppColors.accent,
                                        ),
                                      ),
                                    ),
                                  ],
                                ),
                                const SizedBox(height: 3),
                                Text(
                                  p['dimensions'] as String,
                                  style: GoogleFonts.inter(
                                    fontSize: 11,
                                    fontWeight: FontWeight.w600,
                                    color: AppColors.accent,
                                  ),
                                ),
                                const SizedBox(height: 6),
                                Text(
                                  p['desc'] as String,
                                  style: GoogleFonts.inter(
                                    fontSize: 12,
                                    color: AppColors.textMuted,
                                    height: 1.35,
                                  ),
                                ),
                              ],
                            ),
                          ),
                        ],
                      ),
                      const SizedBox(height: 16),
                      Row(
                        children: [
                          Expanded(
                            child: OutlinedButton.icon(
                              onPressed: () {
                                Navigator.push(
                                  context,
                                  MaterialPageRoute(builder: (context) => p['screen'] as Widget),
                                );
                              },
                              style: OutlinedButton.styleFrom(
                                foregroundColor: AppColors.textDark,
                                side: const BorderSide(color: AppColors.borderSubtle),
                                shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(12)),
                                padding: const EdgeInsets.symmetric(vertical: 10),
                              ),
                              icon: const Icon(Icons.visibility_outlined, size: 16),
                              label: const Text('Browse Designs'),
                            ),
                          ),
                          const SizedBox(width: 10),
                          Expanded(
                            child: ElevatedButton.icon(
                              onPressed: () {
                                MemorialStateService.instance.updateDraft(
                                  productId: p['editorType'] as String,
                                );
                                final eType = p['editorType'] as String;
                                Widget targetScreen;
                                if (eType == 'cards') {
                                  targetScreen = PrayerCardEditorScreen(initialThemeId: activeDraft.themeId);
                                } else if (eType == 'invitation') {
                                  targetScreen = InvitationEditorScreen(initialThemeId: activeDraft.themeId);
                                } else if (eType == 'thank-you') {
                                  targetScreen = ThankYouEditorScreen(initialThemeId: activeDraft.themeId);
                                } else {
                                  targetScreen = PrayerCardEditorScreen(initialThemeId: activeDraft.themeId);
                                }

                                Navigator.push(
                                  context,
                                  MaterialPageRoute(builder: (context) => targetScreen),
                                );
                              },
                              style: ElevatedButton.styleFrom(
                                backgroundColor: AppColors.primary,
                                foregroundColor: Colors.white,
                                shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(12)),
                                padding: const EdgeInsets.symmetric(vertical: 10),
                              ),
                              icon: const Icon(Icons.brush_outlined, size: 16),
                              label: const Text('Customize Now'),
                            ),
                          ),
                        ],
                      ),
                    ],
                  ),
                );
              },
            ),
            const SizedBox(height: 30),
          ],
        ),
      ),
    );
  }
}
