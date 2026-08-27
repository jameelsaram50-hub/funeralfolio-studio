import 'package:flutter/material.dart';
import 'package:google_fonts/google_fonts.dart';
import '../theme/app_theme.dart';
import '../services/memorial_state_service.dart';
import 'obituary_writer_screen.dart';

class AiStudioHubScreen extends StatelessWidget {
  const AiStudioHubScreen({super.key});

  @override
  Widget build(BuildContext context) {
    final activeDraft = MemorialStateService.instance.activeMemorial;

    final List<Map<String, dynamic>> tools = [
      {
        'title': 'AI Obituary Writer',
        'badge': 'Writing Assistant',
        'subtitle': 'Answer thoughtful life questions or enter bullet points to generate a beautiful, heartfelt obituary with customized tones (Warm, Traditional, Celebratory, Sacred).',
        'icon': Icons.edit_note,
        'color': AppColors.primary,
        'screen': const ObituaryWriterScreen(),
      },
    ];

    return Scaffold(
      backgroundColor: AppColors.bgMain,
      appBar: AppBar(
        title: Text(
          'AI Creative Studio Suite',
          style: GoogleFonts.playfairDisplay(fontWeight: FontWeight.bold),
        ),
      ),
      body: SingleChildScrollView(
        padding: const EdgeInsets.symmetric(horizontal: 20, vertical: 16),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            // Active Honoree banner
            Container(
              padding: const EdgeInsets.all(16),
              decoration: BoxDecoration(
                color: Colors.white,
                borderRadius: BorderRadius.circular(16),
                border: Border.all(color: AppColors.accent.withValues(alpha: 0.4)),
              ),
              child: Row(
                children: [
                  const Icon(Icons.auto_awesome, color: AppColors.accent, size: 20),
                  const SizedBox(width: 10),
                  Expanded(
                    child: Text(
                      'AI Studio Context: Active Draft for "${activeDraft.name}"',
                      style: GoogleFonts.inter(
                        fontSize: 12,
                        fontWeight: FontWeight.bold,
                        color: AppColors.textDark,
                      ),
                    ),
                  ),
                ],
              ),
            ),

            const SizedBox(height: 20),

            Text(
              'Intelligent Bereavement & Memorial AI Tools',
              style: GoogleFonts.playfairDisplay(
                fontSize: 22,
                fontWeight: FontWeight.bold,
                color: AppColors.textDark,
              ),
            ),
            const SizedBox(height: 4),
            Text(
              'Designed to comfort families and save time during difficult funeral preparations.',
              style: GoogleFonts.inter(fontSize: 13, color: AppColors.textMuted),
            ),
            const SizedBox(height: 16),

            // AI Tools List
            ListView.separated(
              shrinkWrap: true,
              physics: const NeverScrollableScrollPhysics(),
              itemCount: tools.length,
              separatorBuilder: (context, index) => const SizedBox(height: 14),
              itemBuilder: (context, index) {
                final t = tools[index];
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
                              color: (t['color'] as Color).withValues(alpha: 0.12),
                              borderRadius: BorderRadius.circular(16),
                            ),
                            child: Icon(t['icon'] as IconData, color: t['color'] as Color, size: 26),
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
                                        t['title'] as String,
                                        style: GoogleFonts.playfairDisplay(
                                          fontSize: 17,
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
                                        t['badge'] as String,
                                        style: GoogleFonts.inter(
                                          fontSize: 10,
                                          fontWeight: FontWeight.bold,
                                          color: AppColors.accent,
                                        ),
                                      ),
                                    ),
                                  ],
                                ),
                                const SizedBox(height: 6),
                                Text(
                                  t['subtitle'] as String,
                                  style: GoogleFonts.inter(
                                    fontSize: 12,
                                    color: AppColors.textMuted,
                                    height: 1.4,
                                  ),
                                ),
                              ],
                            ),
                          ),
                        ],
                      ),
                      const SizedBox(height: 16),
                      SizedBox(
                        width: double.infinity,
                        child: ElevatedButton.icon(
                          onPressed: () {
                            Navigator.push(
                              context,
                              MaterialPageRoute(builder: (context) => t['screen'] as Widget),
                            );
                          },
                          style: ElevatedButton.styleFrom(
                            backgroundColor: t['color'] as Color,
                            foregroundColor: Colors.white,
                            padding: const EdgeInsets.symmetric(vertical: 12),
                            shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(12)),
                          ),
                          icon: const Icon(Icons.auto_awesome, size: 16),
                          label: Text(
                            'Open ${t['title']}',
                            style: GoogleFonts.inter(fontWeight: FontWeight.bold, fontSize: 13),
                          ),
                        ),
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
