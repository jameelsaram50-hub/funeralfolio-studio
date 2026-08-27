import 'package:flutter/material.dart';
import 'package:google_fonts/google_fonts.dart';
import '../theme/app_theme.dart';
import '../models/models.dart';
import '../constants/app_constants.dart';
import '../services/memorial_state_service.dart';
import '../services/supabase_service.dart';
import 'template_gallery_screen.dart';
import 'prayer_cards_screen.dart';
import 'funeral_invitations_screen.dart';
import 'thank_you_cards_screen.dart';
import 'obituary_writer_screen.dart';
import 'prayer_card_editor_screen.dart';
import 'invitation_editor_screen.dart';
import 'thank_you_editor_screen.dart';

class HomeScreen extends StatefulWidget {
  final Function(int)? onNavigateTab;

  const HomeScreen({super.key, this.onNavigateTab});

  @override
  State<HomeScreen> createState() => _HomeScreenState();
}

class _HomeScreenState extends State<HomeScreen> {
  final TextEditingController _searchController = TextEditingController();
  final ScrollController _scrollController = ScrollController();
  final FocusNode _searchFocusNode = FocusNode();
  List<Memorial> _memorials = [];
  bool _isLoading = true;
  String _searchQuery = '';

  @override
  void initState() {
    super.initState();
    _loadData();
  }

  @override
  void dispose() {
    _searchController.dispose();
    _scrollController.dispose();
    _searchFocusNode.dispose();
    super.dispose();
  }

  Future<void> _loadData() async {
    final list = await SupabaseService.instance.getMemorials();
    if (mounted) {
      setState(() {
        _memorials = list;
        _isLoading = false;
      });
    }
  }

  @override
  Widget build(BuildContext context) {
    return ListenableBuilder(
      listenable: MemorialStateService.instance,
      builder: (context, _) {
        final activeDraft = MemorialStateService.instance.activeMemorial;
        final theme = MemorialThemes.getById(activeDraft.themeId);

        return Scaffold(
          backgroundColor: const Color(0xFFF8FAFC),
          body: CustomScrollView(
            controller: _scrollController,
            physics: const BouncingScrollPhysics(),
            slivers: [
              // 1. Sleek Modern Native App Bar
              _buildModernAppBar(context, activeDraft),

              // 2. Dashboard Body Content
              SliverToBoxAdapter(
                child: Padding(
                  padding: const EdgeInsets.symmetric(horizontal: 20, vertical: 16),
                  child: Column(
                    crossAxisAlignment: CrossAxisAlignment.start,
                    children: [
                      // Active Draft Quick Resume Card
                      _buildActiveDraftCard(context, activeDraft, theme),
                      const SizedBox(height: 20),

                      // Hero Action Card
                      _buildHeroCard(context),
                      const SizedBox(height: 24),

                      // "Enter Details Once, Create Everything" Workflow Steps
                      _buildWorkflowPills(context),
                      const SizedBox(height: 28),

                      // Section: Stationery Products
                      _buildSectionHeader(
                        title: 'Stationery Suite',
                        subtitle: 'Coordinated memorial documents ready to customize',
                        actionText: 'View Catalog',
                        onAction: () => widget.onNavigateTab?.call(1),
                      ),
                      const SizedBox(height: 14),
                      _buildStationeryGrid(context),
                      const SizedBox(height: 28),

                      // Section: AI Creative Studio
                      _buildSectionHeader(
                        title: 'AI Memorial Studio',
                        subtitle: 'Smart writing assistants & photo enhancements',
                        actionText: 'Open Studio',
                        onAction: () => widget.onNavigateTab?.call(3),
                      ),
                      const SizedBox(height: 14),
                      _buildAiToolsGrid(context),
                      const SizedBox(height: 28),

                      // Section: Featured Themes Carousel
                      _buildSectionHeader(
                        title: 'Curated Themes',
                        subtitle: 'Matching palettes across all 7 stationery formats',
                        actionText: '40+ Gallery',
                        onAction: () {
                          Navigator.push(
                            context,
                            MaterialPageRoute(builder: (context) => const TemplateGalleryScreen()),
                          );
                        },
                      ),
                      const SizedBox(height: 14),
                      _buildThemesRow(context),
                      const SizedBox(height: 28),

                      // Section: Public Notices & Directory
                      _buildSectionHeader(
                        title: 'Memorial Directory',
                        subtitle: 'Search and view published family tribute spaces',
                      ),
                      const SizedBox(height: 12),
                      _buildSearchAndMemorials(context),
                      const SizedBox(height: 40),
                    ],
                  ),
                ),
              ),
            ],
          ),
        );
      },
    );
  }

  Widget _buildModernAppBar(BuildContext context, Memorial activeDraft) {
    return SliverAppBar(
      pinned: true,
      elevation: 0,
      backgroundColor: Colors.white,
      title: Row(
        children: [
          Container(
            width: 36,
            height: 36,
            decoration: BoxDecoration(
              gradient: const LinearGradient(
                colors: [Color(0xFF2C1810), Color(0xFF1A0F0A)],
                begin: Alignment.topLeft,
                end: Alignment.bottomRight,
              ),
              borderRadius: BorderRadius.circular(10),
              boxShadow: [
                BoxShadow(
                  color: const Color(0xFF2C1810).withValues(alpha: 0.2),
                  blurRadius: 8,
                  offset: const Offset(0, 2),
                ),
              ],
            ),
            child: const Center(
              child: Icon(Icons.eco, color: Color(0xFFD4AF37), size: 20),
            ),
          ),
          const SizedBox(width: 10),
          Column(
            crossAxisAlignment: CrossAxisAlignment.start,
            mainAxisSize: MainAxisSize.min,
            children: [
              Text(
                'FuneralFolio',
                style: GoogleFonts.playfairDisplay(
                  fontSize: 18,
                  fontWeight: FontWeight.bold,
                  color: const Color(0xFF1E293B),
                ),
              ),
              Text(
                'MEMORIAL PLATFORM',
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
      actions: [
        IconButton(
          icon: const Icon(Icons.search, color: Color(0xFF1E293B), size: 22),
          tooltip: 'Search Memorial Notices',
          onPressed: () {
            _searchFocusNode.requestFocus();
            if (_scrollController.hasClients) {
              _scrollController.animateTo(
                _scrollController.position.maxScrollExtent,
                duration: const Duration(milliseconds: 500),
                curve: Curves.easeInOut,
              );
            }
          },
        ),
        Padding(
          padding: const EdgeInsets.only(right: 14),
          child: InkWell(
            onTap: () {
              Navigator.push(
                context,
                MaterialPageRoute(builder: (context) => const TemplateGalleryScreen()),
              );
            },
            borderRadius: BorderRadius.circular(20),
            child: Container(
              padding: const EdgeInsets.symmetric(horizontal: 14, vertical: 7),
              decoration: BoxDecoration(
                gradient: const LinearGradient(
                  colors: [Color(0xFF2C1810), Color(0xFF4A2E1B)],
                ),
                borderRadius: BorderRadius.circular(20),
                boxShadow: [
                  BoxShadow(
                    color: const Color(0xFF2C1810).withValues(alpha: 0.2),
                    blurRadius: 6,
                    offset: const Offset(0, 2),
                  ),
                ],
              ),
              child: Row(
                mainAxisSize: MainAxisSize.min,
                children: [
                  const Icon(Icons.auto_awesome, size: 13, color: Color(0xFFD4AF37)),
                  const SizedBox(width: 5),
                  Text(
                    'Create Set',
                    style: GoogleFonts.inter(
                      fontSize: 11,
                      fontWeight: FontWeight.bold,
                      color: Colors.white,
                    ),
                  ),
                ],
              ),
            ),
          ),
        ),
      ],
    );
  }

  Widget _buildActiveDraftCard(BuildContext context, Memorial draft, MemorialThemeConfig theme) {
    return Container(
      padding: const EdgeInsets.all(16),
      decoration: BoxDecoration(
        color: Colors.white,
        borderRadius: BorderRadius.circular(20),
        border: Border.all(color: const Color(0xFFE2E8F0)),
        boxShadow: [
          BoxShadow(
            color: Colors.black.withValues(alpha: 0.03),
            blurRadius: 12,
            offset: const Offset(0, 4),
          ),
        ],
      ),
      child: Row(
        children: [
          Container(
            width: 52,
            height: 52,
            decoration: BoxDecoration(
              color: theme.primaryColor,
              borderRadius: BorderRadius.circular(14),
              border: Border.all(color: theme.accentColor, width: 1.5),
            ),
            child: ClipRRect(
              borderRadius: BorderRadius.circular(13),
              child: draft.photoUrl != null && draft.photoUrl!.isNotEmpty
                  ? Image.network(
                      draft.photoUrl!,
                      fit: BoxFit.cover,
                      errorBuilder: (context, error, stackTrace) => Icon(Icons.person, color: theme.accentColor),
                    )
                  : Icon(Icons.person, color: theme.accentColor),
            ),
          ),
          const SizedBox(width: 14),
          Expanded(
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                Row(
                  children: [
                    Container(
                      width: 7,
                      height: 7,
                      decoration: const BoxDecoration(
                        color: Color(0xFF10B981),
                        shape: BoxShape.circle,
                      ),
                    ),
                    const SizedBox(width: 6),
                    Text(
                      'ACTIVE DRAFT',
                      style: GoogleFonts.inter(
                        fontSize: 9,
                        fontWeight: FontWeight.w800,
                        letterSpacing: 1,
                        color: const Color(0xFF10B981),
                      ),
                    ),
                    const Spacer(),
                    Text(
                      theme.name,
                      style: GoogleFonts.inter(
                        fontSize: 10,
                        fontWeight: FontWeight.w600,
                        color: const Color(0xFF967440),
                      ),
                    ),
                  ],
                ),
                const SizedBox(height: 2),
                Text(
                  draft.name,
                  maxLines: 1,
                  overflow: TextOverflow.ellipsis,
                  style: GoogleFonts.playfairDisplay(
                    fontSize: 16,
                    fontWeight: FontWeight.bold,
                    color: const Color(0xFF1E293B),
                  ),
                ),
                Text(
                  '${draft.birthDate ?? "1942"} — ${draft.deathDate ?? "2026"} • Synced Across All Stationery',
                  maxLines: 1,
                  overflow: TextOverflow.ellipsis,
                  style: GoogleFonts.inter(
                    fontSize: 11,
                    color: const Color(0xFF64748B),
                  ),
                ),
              ],
            ),
          ),
          const SizedBox(width: 10),
          ElevatedButton(
            onPressed: () {
              final pId = draft.productId ?? 'cards';
              Widget target;
              if (pId == 'cards') {
                target = PrayerCardEditorScreen(initialThemeId: draft.themeId);
              } else if (pId == 'invitation') {
                target = InvitationEditorScreen(initialThemeId: draft.themeId);
              } else if (pId == 'thank-you') {
                target = ThankYouEditorScreen(initialThemeId: draft.themeId);
              } else {
                target = PrayerCardEditorScreen(initialThemeId: draft.themeId);
              }
              Navigator.push(context, MaterialPageRoute(builder: (context) => target));
            },
            style: ElevatedButton.styleFrom(
              backgroundColor: const Color(0xFF1E293B),
              foregroundColor: Colors.white,
              shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(12)),
              padding: const EdgeInsets.symmetric(horizontal: 14, vertical: 10),
              elevation: 0,
            ),
            child: Text(
              'Resume',
              style: GoogleFonts.inter(fontSize: 11, fontWeight: FontWeight.bold),
            ),
          ),
        ],
      ),
    );
  }

  Widget _buildHeroCard(BuildContext context) {
    return Container(
      width: double.infinity,
      padding: const EdgeInsets.all(22),
      decoration: BoxDecoration(
        gradient: const LinearGradient(
          colors: [Color(0xFF2C1810), Color(0xFF1A0F0A)],
          begin: Alignment.topLeft,
          end: Alignment.bottomRight,
        ),
        borderRadius: BorderRadius.circular(24),
        boxShadow: [
          BoxShadow(
            color: const Color(0xFF2C1810).withValues(alpha: 0.25),
            blurRadius: 20,
            offset: const Offset(0, 8),
          ),
        ],
      ),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          Container(
            padding: const EdgeInsets.symmetric(horizontal: 10, vertical: 4),
            decoration: BoxDecoration(
              color: const Color(0xFF967440).withValues(alpha: 0.25),
              borderRadius: BorderRadius.circular(12),
              border: Border.all(color: const Color(0xFFD4AF37).withValues(alpha: 0.3)),
            ),
            child: Row(
              mainAxisSize: MainAxisSize.min,
              children: [
                const Icon(Icons.verified_outlined, size: 12, color: Color(0xFFD4AF37)),
                const SizedBox(width: 5),
                Text(
                  'Everything Coordinated — Enter Details Once',
                  style: GoogleFonts.inter(
                    fontSize: 10,
                    fontWeight: FontWeight.w700,
                    color: const Color(0xFFF7F5F2),
                  ),
                ),
              ],
            ),
          ),
          const SizedBox(height: 14),
          RichText(
            text: TextSpan(
              style: GoogleFonts.playfairDisplay(
                fontSize: 24,
                fontWeight: FontWeight.bold,
                color: Colors.white,
                height: 1.25,
              ),
              children: [
                const TextSpan(text: 'Honor Their Legacy With '),
                TextSpan(
                  text: 'Dignity',
                  style: GoogleFonts.playfairDisplay(
                    fontStyle: FontStyle.italic,
                    color: const Color(0xFFD4AF37),
                  ),
                ),
              ],
            ),
          ),
          const SizedBox(height: 8),
          Text(
            'Create matching 300 DPI funeral programs, keepsake prayer cards, invitations, thank you notes, and online tribute spaces in minutes.',
            style: GoogleFonts.inter(
              fontSize: 12,
              color: const Color(0xFFD2C2AD),
              height: 1.4,
            ),
          ),
          const SizedBox(height: 18),
          Row(
            children: [
              Expanded(
                child: ElevatedButton.icon(
                  onPressed: () {
                    Navigator.push(
                      context,
                      MaterialPageRoute(builder: (context) => const TemplateGalleryScreen()),
                    );
                  },
                  style: ElevatedButton.styleFrom(
                    backgroundColor: const Color(0xFF967440),
                    foregroundColor: Colors.white,
                    padding: const EdgeInsets.symmetric(vertical: 14),
                    shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(14)),
                    elevation: 0,
                  ),
                  icon: const Icon(Icons.style_outlined, size: 14),
                  label: Text(
                    'Explore All Templates',
                    style: GoogleFonts.inter(fontSize: 12, fontWeight: FontWeight.bold),
                  ),
                ),
              ),
              const SizedBox(width: 10),
              OutlinedButton(
                onPressed: () {
                  Navigator.push(
                    context,
                    MaterialPageRoute(builder: (context) => const TemplateGalleryScreen()),
                  );
                },
                style: OutlinedButton.styleFrom(
                  foregroundColor: Colors.white,
                  side: BorderSide(color: Colors.white.withValues(alpha: 0.3)),
                  padding: const EdgeInsets.symmetric(horizontal: 16, vertical: 14),
                  shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(14)),
                ),
                child: Text(
                  'Browse 40+ Designs',
                  style: GoogleFonts.inter(fontSize: 12, fontWeight: FontWeight.w600),
                ),
              ),
            ],
          ),
        ],
      ),
    );
  }

  Widget _buildWorkflowPills(BuildContext context) {
    final steps = [
      {'num': '1', 'title': 'Enter Details', 'desc': 'Add names, photos & dates'},
      {'num': '2', 'title': 'Pick Theme', 'desc': 'Select matching luxury style'},
      {'num': '3', 'title': 'Live Editor', 'desc': 'Customize in visual canvas'},
      {'num': '4', 'title': 'Print 300 DPI', 'desc': 'Instant vector PDF export'},
    ];

    return Container(
      padding: const EdgeInsets.all(16),
      decoration: BoxDecoration(
        color: Colors.white,
        borderRadius: BorderRadius.circular(20),
        border: Border.all(color: const Color(0xFFE2E8F0)),
      ),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          Row(
            children: [
              const Icon(Icons.sync_alt, size: 14, color: Color(0xFF967440)),
              const SizedBox(width: 6),
              Text(
                'THE UNIFIED WORKFLOW',
                style: GoogleFonts.inter(
                  fontSize: 10,
                  fontWeight: FontWeight.w800,
                  letterSpacing: 1.2,
                  color: const Color(0xFF967440),
                ),
              ),
            ],
          ),
          const SizedBox(height: 12),
          Row(
            children: steps.map((s) {
              return Expanded(
                child: Padding(
                  padding: const EdgeInsets.symmetric(horizontal: 4),
                  child: Column(
                    crossAxisAlignment: CrossAxisAlignment.start,
                    children: [
                      Container(
                        width: 22,
                        height: 22,
                        decoration: const BoxDecoration(
                          color: Color(0xFFFDFAF7),
                          shape: BoxShape.circle,
                        ),
                        child: Center(
                          child: Text(
                            s['num']!,
                            style: GoogleFonts.inter(fontSize: 11, fontWeight: FontWeight.bold, color: const Color(0xFF967440)),
                          ),
                        ),
                      ),
                      const SizedBox(height: 6),
                      Text(
                        s['title']!,
                        maxLines: 1,
                        overflow: TextOverflow.ellipsis,
                        style: GoogleFonts.inter(fontSize: 11, fontWeight: FontWeight.bold, color: const Color(0xFF1E293B)),
                      ),
                      Text(
                        s['desc']!,
                        maxLines: 1,
                        overflow: TextOverflow.ellipsis,
                        style: GoogleFonts.inter(fontSize: 9, color: const Color(0xFF94A3B8)),
                      ),
                    ],
                  ),
                ),
              );
            }).toList(),
          ),
        ],
      ),
    );
  }

  Widget _buildSectionHeader({
    required String title,
    required String subtitle,
    String? actionText,
    VoidCallback? onAction,
  }) {
    return Row(
      mainAxisAlignment: MainAxisAlignment.spaceBetween,
      crossAxisAlignment: CrossAxisAlignment.end,
      children: [
        Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            Text(
              title,
              style: GoogleFonts.playfairDisplay(
                fontSize: 18,
                fontWeight: FontWeight.bold,
                color: const Color(0xFF1E293B),
              ),
            ),
            const SizedBox(height: 2),
            Text(
              subtitle,
              style: GoogleFonts.inter(fontSize: 11, color: const Color(0xFF64748B)),
            ),
          ],
        ),
        if (actionText != null)
          InkWell(
            onTap: onAction,
            child: Text(
              '$actionText →',
              style: GoogleFonts.inter(
                fontSize: 11,
                fontWeight: FontWeight.bold,
                color: const Color(0xFF967440),
              ),
            ),
          ),
      ],
    );
  }

  Widget _buildStationeryGrid(BuildContext context) {
    final products = [
      {
        'title': 'AI Obituary Writer',
        'desc': 'Guided life story generator with tone options',
        'tag': 'AI Tool',
        'icon': Icons.edit_note,
        'screen': const ObituaryWriterScreen(),
      },
      {
        'title': 'Prayer & Keepsakes',
        'desc': 'Pocket scripture cards with portrait arch',
        'tag': '2.5" x 4.25"',
        'icon': Icons.favorite,
        'screen': const PrayerCardsScreen(),
      },
      {
        'title': 'Funeral Invitations',
        'desc': 'Service ceremony announcement with RSVP',
        'tag': '5" x 7"',
        'icon': Icons.mail_outline,
        'screen': const FuneralInvitationsScreen(),
      },
      {
        'title': 'Thank You Notes',
        'desc': 'Family acknowledgment cards with signatures',
        'tag': '4" x 6"',
        'icon': Icons.favorite_border,
        'screen': const ThankYouCardsScreen(),
      },
    ];

    return GridView.builder(
      shrinkWrap: true,
      physics: const NeverScrollableScrollPhysics(),
      gridDelegate: const SliverGridDelegateWithFixedCrossAxisCount(
        crossAxisCount: 2,
        crossAxisSpacing: 12,
        mainAxisSpacing: 12,
        childAspectRatio: 1.2,
      ),
      itemCount: products.length,
      itemBuilder: (context, index) {
        final p = products[index];
        return InkWell(
          onTap: () {
            Navigator.push(
              context,
              MaterialPageRoute(builder: (context) => p['screen'] as Widget),
            );
          },
          borderRadius: BorderRadius.circular(18),
          child: Container(
            padding: const EdgeInsets.all(14),
            decoration: BoxDecoration(
              color: Colors.white,
              borderRadius: BorderRadius.circular(18),
              border: Border.all(color: const Color(0xFFE2E8F0)),
              boxShadow: [
                BoxShadow(
                  color: Colors.black.withValues(alpha: 0.02),
                  blurRadius: 8,
                  offset: const Offset(0, 2),
                ),
              ],
            ),
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              mainAxisAlignment: MainAxisAlignment.spaceBetween,
              children: [
                Row(
                  mainAxisAlignment: MainAxisAlignment.spaceBetween,
                  children: [
                    Container(
                      padding: const EdgeInsets.all(8),
                      decoration: BoxDecoration(
                        color: const Color(0xFFFDFAF7),
                        borderRadius: BorderRadius.circular(10),
                      ),
                      child: Icon(p['icon'] as IconData, color: const Color(0xFF967440), size: 18),
                    ),
                    Container(
                      padding: const EdgeInsets.symmetric(horizontal: 6, vertical: 2),
                      decoration: BoxDecoration(
                        color: const Color(0xFFF1F5F9),
                        borderRadius: BorderRadius.circular(6),
                      ),
                      child: Text(
                        p['tag'] as String,
                        style: GoogleFonts.inter(fontSize: 8, fontWeight: FontWeight.bold, color: const Color(0xFF64748B)),
                      ),
                    ),
                  ],
                ),
                Column(
                  crossAxisAlignment: CrossAxisAlignment.start,
                  children: [
                    Text(
                      p['title'] as String,
                      maxLines: 1,
                      overflow: TextOverflow.ellipsis,
                      style: GoogleFonts.playfairDisplay(fontSize: 14, fontWeight: FontWeight.bold, color: const Color(0xFF1E293B)),
                    ),
                    const SizedBox(height: 2),
                    Text(
                      p['desc'] as String,
                      maxLines: 2,
                      overflow: TextOverflow.ellipsis,
                      style: GoogleFonts.inter(fontSize: 10, color: const Color(0xFF64748B), height: 1.3),
                    ),
                  ],
                ),
                Row(
                  children: [
                    Text(
                      'Customize',
                      style: GoogleFonts.inter(fontSize: 10, fontWeight: FontWeight.bold, color: const Color(0xFF967440)),
                    ),
                    const SizedBox(width: 4),
                    const Icon(Icons.arrow_forward, size: 10, color: Color(0xFF967440)),
                  ],
                ),
              ],
            ),
          ),
        );
      },
    );
  }

  Widget _buildAiToolsGrid(BuildContext context) {
    final List<Map<String, dynamic>> aiTools = [
      {
        'title': 'AI Obituary Writer',
        'desc': 'Answer questions to generate heartfelt biography tributes',
        'icon': Icons.edit_note,
        'badge': 'Auto-Syncs',
        'screen': const ObituaryWriterScreen(),
      },
      {
        'title': 'Template Studio (100+)',
        'desc': 'Coordinated themes for programs, prayer cards & cards',
        'icon': Icons.style_outlined,
        'badge': 'All Formats',
        'screen': const TemplateGalleryScreen(),
      },
    ];

    return GridView.builder(
      shrinkWrap: true,
      physics: const NeverScrollableScrollPhysics(),
      gridDelegate: const SliverGridDelegateWithFixedCrossAxisCount(
        crossAxisCount: 2,
        crossAxisSpacing: 12,
        mainAxisSpacing: 12,
        childAspectRatio: 1.2,
      ),
      itemCount: aiTools.length,
      itemBuilder: (context, index) {
        final t = aiTools[index];
        return InkWell(
          onTap: () {
            Navigator.push(
              context,
              MaterialPageRoute(builder: (context) => t['screen'] as Widget),
            );
          },
          borderRadius: BorderRadius.circular(18),
          child: Container(
            padding: const EdgeInsets.all(14),
            decoration: BoxDecoration(
              color: Colors.white,
              borderRadius: BorderRadius.circular(18),
              border: Border.all(color: const Color(0xFFE2E8F0)),
              boxShadow: [
                BoxShadow(
                  color: Colors.black.withValues(alpha: 0.02),
                  blurRadius: 8,
                  offset: const Offset(0, 2),
                ),
              ],
            ),
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              mainAxisAlignment: MainAxisAlignment.spaceBetween,
              children: [
                Row(
                  mainAxisAlignment: MainAxisAlignment.spaceBetween,
                  children: [
                    Container(
                      padding: const EdgeInsets.all(8),
                      decoration: BoxDecoration(
                        color: const Color(0xFFFDFAF7),
                        borderRadius: BorderRadius.circular(10),
                      ),
                      child: Icon(t['icon'] as IconData, color: const Color(0xFF967440), size: 18),
                    ),
                    Container(
                      padding: const EdgeInsets.symmetric(horizontal: 6, vertical: 2),
                      decoration: BoxDecoration(
                        color: const Color(0xFF967440).withValues(alpha: 0.1),
                        borderRadius: BorderRadius.circular(6),
                      ),
                      child: Text(
                        t['badge'] as String,
                        style: GoogleFonts.inter(fontSize: 8, fontWeight: FontWeight.bold, color: const Color(0xFF967440)),
                      ),
                    ),
                  ],
                ),
                Column(
                  crossAxisAlignment: CrossAxisAlignment.start,
                  children: [
                    Text(
                      t['title'] as String,
                      maxLines: 1,
                      overflow: TextOverflow.ellipsis,
                      style: GoogleFonts.playfairDisplay(fontSize: 14, fontWeight: FontWeight.bold, color: const Color(0xFF1E293B)),
                    ),
                    const SizedBox(height: 2),
                    Text(
                      t['desc'] as String,
                      maxLines: 2,
                      overflow: TextOverflow.ellipsis,
                      style: GoogleFonts.inter(fontSize: 10, color: const Color(0xFF64748B), height: 1.3),
                    ),
                  ],
                ),
                Row(
                  children: [
                    Text(
                      'Launch Tool',
                      style: GoogleFonts.inter(fontSize: 10, fontWeight: FontWeight.bold, color: const Color(0xFF967440)),
                    ),
                    const SizedBox(width: 4),
                    const Icon(Icons.arrow_forward, size: 10, color: Color(0xFF967440)),
                  ],
                ),
              ],
            ),
          ),
        );
      },
    );
  }

  Widget _buildThemesRow(BuildContext context) {
    final featuredThemes = [
      {
        'id': 'watercolor-roses',
        'name': 'Watercolor Roses',
        'category': 'Floral',
        'image': 'https://images.unsplash.com/photo-1526047932273-341f2a7631f9?q=80&w=800',
      },
      {
        'id': 'victorian-lace',
        'name': 'Victorian Lace',
        'category': 'Classic',
        'image': 'https://images.unsplash.com/photo-1517245386807-bb43f82c33c4?q=80&w=800',
      },
      {
        'id': 'mountain-serenity',
        'name': 'Mountain Serenity',
        'category': 'Nature',
        'image': 'https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?q=80&w=800',
      },
      {
        'id': 'ocean-sunset',
        'name': 'Ocean Sunset',
        'category': 'Spiritual',
        'image': 'https://images.unsplash.com/photo-1518837695005-2083093ee35b?q=80&w=800',
      },
    ];

    return SizedBox(
      height: 180,
      child: ListView.separated(
        scrollDirection: Axis.horizontal,
        physics: const BouncingScrollPhysics(),
        itemCount: featuredThemes.length,
        separatorBuilder: (context, index) => const SizedBox(width: 12),
        itemBuilder: (context, index) {
          final t = featuredThemes[index];
          return InkWell(
            onTap: () {
              MemorialStateService.instance.updateDraft(themeId: t['id']!);
              Navigator.push(
                context,
                MaterialPageRoute(
                  builder: (context) => PrayerCardEditorScreen(initialThemeId: t['id']!),
                ),
              );
            },
            borderRadius: BorderRadius.circular(18),
            child: Container(
              width: 140,
              decoration: BoxDecoration(
                color: Colors.white,
                borderRadius: BorderRadius.circular(18),
                border: Border.all(color: const Color(0xFFE2E8F0)),
                boxShadow: [
                  BoxShadow(
                    color: Colors.black.withValues(alpha: 0.03),
                    blurRadius: 8,
                    offset: const Offset(0, 2),
                  ),
                ],
              ),
              child: ClipRRect(
                borderRadius: BorderRadius.circular(18),
                child: Column(
                  crossAxisAlignment: CrossAxisAlignment.start,
                  children: [
                    Expanded(
                      child: Stack(
                        children: [
                          Positioned.fill(
                            child: Image.network(
                              t['image']!,
                              fit: BoxFit.cover,
                              errorBuilder: (context, error, stackTrace) => Container(color: const Color(0xFF1E293B)),
                            ),
                          ),
                          Positioned(
                            top: 8,
                            left: 8,
                            child: Container(
                              padding: const EdgeInsets.symmetric(horizontal: 6, vertical: 2),
                              decoration: BoxDecoration(
                                color: Colors.black.withValues(alpha: 0.6),
                                borderRadius: BorderRadius.circular(6),
                              ),
                              child: Text(
                                t['category']!.toUpperCase(),
                                style: GoogleFonts.inter(
                                  fontSize: 8,
                                  fontWeight: FontWeight.bold,
                                  color: Colors.white,
                                ),
                              ),
                            ),
                          ),
                        ],
                      ),
                    ),
                    Padding(
                      padding: const EdgeInsets.all(10),
                      child: Column(
                        crossAxisAlignment: CrossAxisAlignment.start,
                        children: [
                          Text(
                            t['name']!,
                            maxLines: 1,
                            overflow: TextOverflow.ellipsis,
                            style: GoogleFonts.playfairDisplay(
                              fontSize: 13,
                              fontWeight: FontWeight.bold,
                              color: const Color(0xFF1E293B),
                            ),
                          ),
                          Text(
                            'Matching Set',
                            style: GoogleFonts.inter(
                              fontSize: 10,
                              color: const Color(0xFF967440),
                              fontWeight: FontWeight.w600,
                            ),
                          ),
                        ],
                      ),
                    ),
                  ],
                ),
              ),
            ),
          );
        },
      ),
    );
  }

  Widget _buildSearchAndMemorials(BuildContext context) {
    if (_isLoading) {
      return const Padding(
        padding: EdgeInsets.symmetric(vertical: 20),
        child: Center(child: CircularProgressIndicator(color: Color(0xFF967440))),
      );
    }

    final items = _memorials.isNotEmpty
        ? _memorials
        : AppConstants.recentObituaries.map((o) {
            return Memorial(
              id: o['name']!.toLowerCase().replaceAll(' ', '-'),
              name: o['name']!,
              birthDate: o['birth'],
              deathDate: o['death'],
              serviceLocation: o['location'],
              photoUrl: o['photo'],
              themeId: o['theme'],
              biography: 'Honoring the cherished memory and legacy of ${o['name']}.',
            );
          }).toList();

    final filtered = _searchQuery.isEmpty
        ? items
        : items.where((m) {
            return m.name.toLowerCase().contains(_searchQuery.toLowerCase()) ||
                (m.serviceLocation ?? '').toLowerCase().contains(_searchQuery.toLowerCase());
          }).toList();

    return Column(
      children: [
        TextField(
          controller: _searchController,
          focusNode: _searchFocusNode,
          onChanged: (val) => setState(() => _searchQuery = val),
          decoration: InputDecoration(
            hintText: 'Search memorial notices...',
            hintStyle: GoogleFonts.inter(fontSize: 13, color: const Color(0xFF94A3B8)),
            prefixIcon: const Icon(Icons.search, size: 18, color: Color(0xFF64748B)),
            filled: true,
            fillColor: Colors.white,
            contentPadding: const EdgeInsets.symmetric(horizontal: 14, vertical: 10),
            border: OutlineInputBorder(
              borderRadius: BorderRadius.circular(14),
              borderSide: const BorderSide(color: Color(0xFFE2E8F0)),
            ),
            enabledBorder: OutlineInputBorder(
              borderRadius: BorderRadius.circular(14),
              borderSide: const BorderSide(color: Color(0xFFE2E8F0)),
            ),
          ),
        ),
        const SizedBox(height: 12),
        ListView.separated(
          shrinkWrap: true,
          physics: const NeverScrollableScrollPhysics(),
          itemCount: filtered.length > 3 ? 3 : filtered.length,
          separatorBuilder: (context, index) => const SizedBox(height: 8),
          itemBuilder: (context, index) {
            final m = filtered[index];
            return InkWell(
              onTap: () {
                MemorialStateService.instance.updateDraft(
                  name: m.name,
                  birthDate: m.birthDate,
                  deathDate: m.deathDate,
                  serviceLocation: m.serviceLocation,
                  photoUrl: m.photoUrl,
                  themeId: m.themeId,
                  biography: m.biography,
                );
                Navigator.push(
                  context,
                  MaterialPageRoute(builder: (context) => const ObituaryWriterScreen()),
                );
              },
              borderRadius: BorderRadius.circular(14),
              child: Container(
                padding: const EdgeInsets.all(12),
                decoration: BoxDecoration(
                  color: Colors.white,
                  borderRadius: BorderRadius.circular(14),
                  border: Border.all(color: const Color(0xFFE2E8F0)),
                ),
                child: Row(
                  children: [
                    ClipRRect(
                      borderRadius: BorderRadius.circular(10),
                      child: Container(
                        width: 38,
                        height: 38,
                        color: const Color(0xFFFDFAF7),
                        child: m.photoUrl != null && m.photoUrl!.isNotEmpty
                            ? Image.network(
                                m.photoUrl!,
                                fit: BoxFit.cover,
                                errorBuilder: (context, error, stackTrace) => const Icon(Icons.person, color: Colors.grey, size: 20),
                              )
                            : const Icon(Icons.person, color: Colors.grey, size: 20),
                      ),
                    ),
                    const SizedBox(width: 12),
                    Expanded(
                      child: Column(
                        crossAxisAlignment: CrossAxisAlignment.start,
                        children: [
                          Text(
                            m.name,
                            style: GoogleFonts.playfairDisplay(fontSize: 14, fontWeight: FontWeight.bold, color: const Color(0xFF1E293B)),
                          ),
                          Text(
                            '${m.birthDate ?? "1942"} — ${m.deathDate ?? "2026"}',
                            style: GoogleFonts.inter(fontSize: 10, color: const Color(0xFF64748B)),
                          ),
                        ],
                      ),
                    ),
                    Text(
                      'Edit Obituary →',
                      style: GoogleFonts.inter(fontSize: 10, fontWeight: FontWeight.bold, color: const Color(0xFF967440)),
                    ),
                  ],
                ),
              ),
            );
          },
        ),
      ],
    );
  }
}
