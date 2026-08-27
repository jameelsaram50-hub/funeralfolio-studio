import 'package:flutter/material.dart';
import 'package:google_fonts/google_fonts.dart';
import '../theme/app_theme.dart';
import '../models/models.dart';
import '../services/memorial_state_service.dart';
import 'checkout_screen.dart';

class EditorScreen extends StatefulWidget {
  final TemplateItem? templateItem;
  final String? initialProductType;
  final String? initialThemeId;

  const EditorScreen({
    super.key,
    this.templateItem,
    this.initialProductType,
    this.initialThemeId,
  });

  @override
  State<EditorScreen> createState() => _EditorScreenState();
}

class _EditorScreenState extends State<EditorScreen> with SingleTickerProviderStateMixin {
  late TabController _tabController;

  late TextEditingController _nameController;
  late TextEditingController _datesController;
  late TextEditingController _quoteController;
  late TextEditingController _venueController;
  late TextEditingController _orderOfServiceController;
  late TextEditingController _prayerVerseController;
  late TextEditingController _photoUrlController;
  late TextEditingController _pallbearersController;

  late String _selectedProductType;
  late String _selectedThemeId;
  int _cardSideIndex = 0; // 0 = Front Cover, 1 = Inside / Back
  bool _isSaving = false;

  final List<Map<String, dynamic>> _productTypes = [
    {
      'id': 'bifold',
      'label': 'Bi-fold Program',
      'dim': '8.5" x 11"',
      'icon': Icons.menu_book,
    },
    {
      'id': 'trifold',
      'label': 'Tri-fold Brochure',
      'dim': '8.5" x 14"',
      'icon': Icons.view_column,
    },
    {
      'id': 'cards',
      'label': 'Prayer Card',
      'dim': '2.5" x 4.25"',
      'icon': Icons.bookmark_border,
    },
    {
      'id': 'invitation',
      'label': '5x7 Invitation',
      'dim': '5" x 7"',
      'icon': Icons.mail_outline,
    },
    {
      'id': 'thank-you',
      'label': 'Thank You Card',
      'dim': '4" x 6"',
      'icon': Icons.favorite_border,
    },
    {
      'id': 'posters',
      'label': 'Easel Poster',
      'dim': '24" x 36"',
      'icon': Icons.photo_size_select_actual,
    },
    {
      'id': 'bookmarks',
      'label': 'Bookmark',
      'dim': '2" x 8"',
      'icon': Icons.bookmark,
    },
  ];

  final List<String> _prayerPresets = [
    'The Lord is my shepherd; I shall not want. He maketh me to lie down in green pastures: he leadeth me beside the still waters. (Psalm 23)',
    'May the road rise up to meet you. May the wind be always at your back. May the sun shine warm upon your face. (Irish Blessing)',
    'Sunset and evening star, and one clear call for me! And may there be no moaning of the bar, when I put out to sea. (Crossing the Bar)',
    'Those we love don\'t go away, they walk beside us every day. Unseen, unheard, but always near, still loved, still missed and very dear.',
  ];

  @override
  void initState() {
    super.initState();
    _tabController = TabController(length: 3, vsync: this);

    final current = MemorialStateService.instance.activeMemorial;

    _selectedProductType = widget.initialProductType ??
        widget.templateItem?.productType ??
        current.productId ??
        'bifold';

    _selectedThemeId = widget.initialThemeId ??
        widget.templateItem?.defaultThemeId ??
        current.themeId ??
        'celestial-gold';

    _nameController = TextEditingController(text: current.name);
    _datesController = TextEditingController(
      text: (current.birthDate != null && current.deathDate != null && current.birthDate!.isNotEmpty)
          ? '${current.birthDate} – ${current.deathDate}'
          : 'March 15, 1942 – January 12, 2026',
    );
    _quoteController = TextEditingController(
      text: current.quote ??
          '"Her life was a blessing, her memory a treasure. She is loved beyond words and missed beyond measure."',
    );
    _venueController = TextEditingController(
      text: current.serviceLocation ?? 'The Historic Serenity Chapel, Savannah GA',
    );
    _orderOfServiceController = TextEditingController(
      text: current.orderOfService ??
          '• Musical Prelude\n• Welcome & Opening Prayer — Rev. Thomas\n• Sacred Scripture Reading: Psalm 23\n• Family Reflections & Tributes\n• Musical Blessing: "Amazing Grace"\n• Benediction & Committal',
    );
    _prayerVerseController = TextEditingController(
      text: current.prayerVerse ?? _prayerPresets[0],
    );
    _photoUrlController = TextEditingController(
      text: current.photoUrl ??
          'https://images.unsplash.com/photo-1544005313-94ddf0286df2?q=80&w=600&auto=format&fit=crop',
    );
    _pallbearersController = TextEditingController(
      text: current.pallbearers ?? 'David Vance, Marcus Lee, Jonathan Hayes, Robert Campbell',
    );
  }

  @override
  void dispose() {
    _tabController.dispose();
    _nameController.dispose();
    _datesController.dispose();
    _quoteController.dispose();
    _venueController.dispose();
    _orderOfServiceController.dispose();
    _prayerVerseController.dispose();
    _photoUrlController.dispose();
    _pallbearersController.dispose();
    super.dispose();
  }

  void _syncWithGlobalState() {
    final dates = _datesController.text.split('–');
    String? dob = dates.isNotEmpty ? dates[0].trim() : null;
    String? dod = dates.length > 1 ? dates[1].trim() : null;

    MemorialStateService.instance.updateFields(
      name: _nameController.text.trim(),
      birthDate: dob,
      deathDate: dod,
      quote: _quoteController.text.trim(),
      serviceLocation: _venueController.text.trim(),
      orderOfService: _orderOfServiceController.text.trim(),
      prayerVerse: _prayerVerseController.text.trim(),
      photoUrl: _photoUrlController.text.trim(),
      pallbearers: _pallbearersController.text.trim(),
      themeId: _selectedThemeId,
      productId: _selectedProductType,
      format: _productTypes.firstWhere((p) => p['id'] == _selectedProductType)['label'],
    );
  }

  Future<void> _handleSave() async {
    setState(() => _isSaving = true);
    _syncWithGlobalState();

    try {
      await MemorialStateService.instance.updateMemorial(
        MemorialStateService.instance.activeMemorial,
        syncWithSupabase: true,
      );

      if (mounted) {
        setState(() => _isSaving = false);
        ScaffoldMessenger.of(context).showSnackBar(
          SnackBar(
            backgroundColor: Colors.green.shade800,
            content: Row(
              children: const [
                Icon(Icons.check_circle, color: Colors.white, size: 20),
                SizedBox(width: 10),
                Expanded(
                  child: Text('Memorial design and customization synchronized with Supabase!'),
                ),
              ],
            ),
          ),
        );
      }
    } catch (e) {
      if (mounted) {
        setState(() => _isSaving = false);
        ScaffoldMessenger.of(context).showSnackBar(
          SnackBar(content: Text('Error saving: $e')),
        );
      }
    }
  }

  @override
  Widget build(BuildContext context) {
    final theme = MemorialThemes.getById(_selectedThemeId);

    return Scaffold(
      backgroundColor: AppColors.bgMain,
      appBar: AppBar(
        title: Text(
          widget.templateItem?.title ?? 'Stationery Design Studio',
          style: GoogleFonts.playfairDisplay(fontWeight: FontWeight.bold),
        ),
        actions: [
          IconButton(
            tooltip: 'Save to Supabase',
            icon: _isSaving
                ? const SizedBox(
                    width: 18,
                    height: 18,
                    child: CircularProgressIndicator(strokeWidth: 2, color: AppColors.accent),
                  )
                : const Icon(Icons.cloud_done, color: AppColors.primary),
            onPressed: _isSaving ? null : _handleSave,
          ),
        ],
      ),
      body: Column(
        children: [
          // Product Format Picker
          Container(
            color: Colors.white,
            padding: const EdgeInsets.symmetric(vertical: 8),
            child: SingleChildScrollView(
              scrollDirection: Axis.horizontal,
              padding: const EdgeInsets.symmetric(horizontal: 16),
              child: Row(
                children: _productTypes.map((p) {
                  final isSelected = _selectedProductType == p['id'];
                  return Padding(
                    padding: const EdgeInsets.only(right: 8),
                    child: FilterChip(
                      selected: isSelected,
                      avatar: Icon(
                        p['icon'] as IconData,
                        size: 16,
                        color: isSelected ? Colors.white : AppColors.textMuted,
                      ),
                      label: Text('${p['label']} (${p['dim']})'),
                      labelStyle: GoogleFonts.inter(
                        fontSize: 12,
                        fontWeight: FontWeight.w600,
                        color: isSelected ? Colors.white : AppColors.textDark,
                      ),
                      selectedColor: AppColors.primary,
                      backgroundColor: AppColors.bgSurface,
                      shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(20)),
                      onSelected: (val) {
                        if (val) {
                          setState(() {
                            _selectedProductType = p['id'];
                            _cardSideIndex = 0;
                          });
                          _syncWithGlobalState();
                        }
                      },
                    ),
                  );
                }).toList(),
              ),
            ),
          ),

          // Theme Color Switcher Bar
          Container(
            color: Colors.white,
            padding: const EdgeInsets.fromLTRB(16, 4, 16, 12),
            child: Row(
              children: [
                Text(
                  'Theme:',
                  style: GoogleFonts.inter(
                    fontSize: 12,
                    fontWeight: FontWeight.bold,
                    color: AppColors.textMuted,
                  ),
                ),
                const SizedBox(width: 8),
                Expanded(
                  child: SingleChildScrollView(
                    scrollDirection: Axis.horizontal,
                    child: Row(
                      children: MemorialThemes.allThemes.map((t) {
                        final isSelected = _selectedThemeId == t.id;
                        return Padding(
                          padding: const EdgeInsets.only(right: 8),
                          child: InkWell(
                            onTap: () {
                              setState(() => _selectedThemeId = t.id);
                              _syncWithGlobalState();
                            },
                            borderRadius: BorderRadius.circular(20),
                            child: Container(
                              padding: const EdgeInsets.symmetric(horizontal: 12, vertical: 6),
                              decoration: BoxDecoration(
                                color: isSelected ? t.primaryColor : t.bgColor,
                                borderRadius: BorderRadius.circular(20),
                                border: Border.all(
                                  color: isSelected ? t.accentColor : AppColors.borderSubtle,
                                  width: isSelected ? 2 : 1,
                                ),
                              ),
                              child: Row(
                                mainAxisSize: MainAxisSize.min,
                                children: [
                                  Container(
                                    width: 12,
                                    height: 12,
                                    decoration: BoxDecoration(
                                      color: t.accentColor,
                                      shape: BoxShape.circle,
                                    ),
                                  ),
                                  const SizedBox(width: 6),
                                  Text(
                                    t.name,
                                    style: GoogleFonts.inter(
                                      fontSize: 11,
                                      fontWeight: FontWeight.bold,
                                      color: isSelected ? Colors.white : t.textColor,
                                    ),
                                  ),
                                ],
                              ),
                            ),
                          ),
                        );
                      }).toList(),
                    ),
                  ),
                ),
              ],
            ),
          ),

          const Divider(height: 1, color: AppColors.borderSubtle),

          // Main View (Canvas + Tabs)
          Expanded(
            child: SingleChildScrollView(
              padding: const EdgeInsets.all(16),
              child: Column(
                children: [
                  // Live Dynamic Canvas Preview
                  _buildLiveCanvas(theme),

                  const SizedBox(height: 12),

                  // Side Toggle (Cover vs Inside/Back for foldables & cards)
                  if (_selectedProductType == 'bifold' ||
                      _selectedProductType == 'trifold' ||
                      _selectedProductType == 'cards')
                    Row(
                      mainAxisAlignment: MainAxisAlignment.center,
                      children: [
                        SegmentedButton<int>(
                          segments: [
                            ButtonSegment(
                              value: 0,
                              label: Text(_selectedProductType == 'cards' ? 'Front Side' : 'Cover Page'),
                              icon: const Icon(Icons.flip_to_front, size: 16),
                            ),
                            ButtonSegment(
                              value: 1,
                              label: Text(_selectedProductType == 'cards' ? 'Back (Prayer)' : 'Inside Program'),
                              icon: const Icon(Icons.flip_to_back, size: 16),
                            ),
                          ],
                          selected: {_cardSideIndex},
                          onSelectionChanged: (val) {
                            setState(() => _cardSideIndex = val.first);
                          },
                        ),
                      ],
                    ),

                  const SizedBox(height: 20),

                  // Customization Tab Bar
                  Container(
                    decoration: BoxDecoration(
                      color: Colors.white,
                      borderRadius: BorderRadius.circular(16),
                      border: Border.all(color: AppColors.borderSubtle),
                    ),
                    child: TabBar(
                      controller: _tabController,
                      labelColor: AppColors.primary,
                      unselectedLabelColor: AppColors.textMuted,
                      indicatorColor: AppColors.accent,
                      indicatorWeight: 3,
                      tabs: const [
                        Tab(text: '1. Honoree & Bio', icon: Icon(Icons.person_outline, size: 18)),
                        Tab(text: '2. Product Details', icon: Icon(Icons.view_agenda_outlined, size: 18)),
                        Tab(text: '3. Ceremony & Venue', icon: Icon(Icons.church_outlined, size: 18)),
                      ],
                    ),
                  ),

                  const SizedBox(height: 16),

                  // Tab Content
                  SizedBox(
                    height: 380,
                    child: TabBarView(
                      controller: _tabController,
                      children: [
                        // Tab 1: Honoree Details
                        _buildTab1Honoree(),
                        // Tab 2: Product Specifics (Order of service, prayer verses)
                        _buildTab2ProductDetails(),
                        // Tab 3: Ceremony & Pallbearers
                        _buildTab3Ceremony(),
                      ],
                    ),
                  ),

                  const SizedBox(height: 20),

                  // Save & Sync Button
                  SizedBox(
                    width: double.infinity,
                    height: 54,
                    child: ElevatedButton.icon(
                      onPressed: _isSaving ? null : _handleSave,
                      style: ElevatedButton.styleFrom(
                        backgroundColor: AppColors.primary,
                        shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(16)),
                      ),
                      icon: const Icon(Icons.save_outlined),
                      label: Text(
                        _isSaving ? 'Syncing to Supabase...' : 'Save Memorial Design',
                        style: GoogleFonts.inter(fontWeight: FontWeight.bold, fontSize: 15),
                      ),
                    ),
                  ),

                  const SizedBox(height: 12),

                  SizedBox(
                    width: double.infinity,
                    height: 54,
                    child: ElevatedButton.icon(
                      onPressed: () {
                        _handleSave();
                        Navigator.push(
                          context,
                          MaterialPageRoute(
                            builder: (context) => CheckoutScreen(
                              productName: _getProductName(_selectedProductType),
                              themeId: _selectedThemeId,
                            ),
                          ),
                        );
                      },
                      style: ElevatedButton.styleFrom(
                        backgroundColor: AppColors.accent,
                        foregroundColor: AppColors.primary,
                        shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(16)),
                      ),
                      icon: const Icon(Icons.shopping_bag_outlined),
                      label: Text(
                        'Order Prints & Digital Download',
                        style: GoogleFonts.inter(fontWeight: FontWeight.bold, fontSize: 15),
                      ),
                    ),
                  ),

                  const SizedBox(height: 30),
                ],
              ),
            ),
          ),
        ],
      ),
    );
  }

  // =========================================================================
  // LIVE DYNAMIC CANVASES
  // =========================================================================
  Widget _buildLiveCanvas(MemorialThemeConfig theme) {
    Widget canvas;
    switch (_selectedProductType) {
      case 'bifold':
        canvas = _buildBifoldCanvas(theme);
        break;
      case 'trifold':
        canvas = _buildTrifoldCanvas(theme);
        break;
      case 'cards':
        canvas = _buildPrayerCardCanvas(theme);
        break;
      case 'invitation':
        canvas = _buildInvitationCanvas(theme);
        break;
      case 'thank-you':
        canvas = _buildThankYouCanvas(theme);
        break;
      case 'posters':
        canvas = _buildPosterCanvas(theme);
        break;
      case 'bookmarks':
        canvas = _buildBookmarkCanvas(theme);
        break;
      default:
        canvas = _buildBifoldCanvas(theme);
        break;
    }
    return Center(
      child: FittedBox(
        fit: BoxFit.contain,
        child: canvas,
      ),
    );
  }

  // 1. Bi-fold Canvas
  Widget _buildBifoldCanvas(MemorialThemeConfig theme) {
    if (_cardSideIndex == 1) {
      // Inside Page: Order of Service & Pallbearers
      return Container(
        width: 320,
        height: 420,
        padding: const EdgeInsets.all(20),
        decoration: BoxDecoration(
          color: theme.cardBg,
          borderRadius: BorderRadius.circular(16),
          border: Border.all(color: theme.borderColor, width: 2),
          boxShadow: [
            BoxShadow(color: Colors.black.withValues(alpha: 0.08), blurRadius: 16, offset: const Offset(0, 6)),
          ],
        ),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.center,
          children: [
            Text(
              'ORDER OF SERVICE',
              style: GoogleFonts.inter(
                fontSize: 11,
                letterSpacing: 2.5,
                fontWeight: FontWeight.bold,
                color: theme.accentColor,
              ),
            ),
            const SizedBox(height: 6),
            Text(
              _nameController.text,
              style: GoogleFonts.playfairDisplay(
                fontSize: 16,
                fontWeight: FontWeight.bold,
                color: theme.textColor,
              ),
            ),
            const Divider(height: 18),
            Expanded(
              child: SingleChildScrollView(
                child: Text(
                  _orderOfServiceController.text,
                  style: GoogleFonts.inter(
                    fontSize: 11,
                    height: 1.6,
                    color: theme.textColor,
                  ),
                ),
              ),
            ),
            const Divider(height: 16),
            Text(
              'PALLBEARERS',
              style: GoogleFonts.inter(
                fontSize: 9,
                letterSpacing: 1.5,
                fontWeight: FontWeight.bold,
                color: theme.accentColor,
              ),
            ),
            const SizedBox(height: 4),
            Text(
              _pallbearersController.text,
              textAlign: TextAlign.center,
              maxLines: 2,
              style: GoogleFonts.inter(fontSize: 10, color: theme.textMuted),
            ),
          ],
        ),
      );
    }

    // Cover Page
    return Container(
      width: 290,
      height: 420,
      padding: const EdgeInsets.all(22),
      decoration: BoxDecoration(
        color: theme.cardBg,
        borderRadius: BorderRadius.circular(18),
        border: Border.all(color: theme.borderColor, width: 2),
        boxShadow: [
          BoxShadow(color: Colors.black.withValues(alpha: 0.08), blurRadius: 16, offset: const Offset(0, 6)),
        ],
      ),
      child: Column(
        mainAxisAlignment: MainAxisAlignment.spaceBetween,
        children: [
          Column(
            children: [
              Text(
                'CELEBRATING THE LIFE OF',
                style: GoogleFonts.inter(
                  fontSize: 9,
                  letterSpacing: 2,
                  fontWeight: FontWeight.bold,
                  color: theme.accentColor,
                ),
              ),
              const SizedBox(height: 4),
              Container(width: 40, height: 1.5, color: theme.accentColor),
            ],
          ),
          Container(
            width: 110,
            height: 110,
            decoration: BoxDecoration(
              shape: BoxShape.circle,
              border: Border.all(color: theme.borderColor, width: 2.5),
            ),
            child: ClipOval(
              child: Image.network(
                _photoUrlController.text,
                fit: BoxFit.cover,
                errorBuilder: (context, error, stackTrace) => Container(
                  width: 110,
                  height: 110,
                  color: theme.accentColor.withValues(alpha: 0.2),
                  child: Icon(Icons.person, size: 50, color: theme.accentColor),
                ),
              ),
            ),
          ),
          Column(
            children: [
              Text(
                _nameController.text.isNotEmpty ? _nameController.text : 'Full Name',
                textAlign: TextAlign.center,
                style: GoogleFonts.playfairDisplay(
                  fontSize: 20,
                  fontWeight: FontWeight.bold,
                  color: theme.textColor,
                ),
              ),
              const SizedBox(height: 4),
              Text(
                _datesController.text.isNotEmpty ? _datesController.text : '1942 – 2026',
                style: GoogleFonts.inter(fontSize: 11, color: theme.accentColor, fontWeight: FontWeight.w600),
              ),
            ],
          ),
          Text(
            _quoteController.text,
            textAlign: TextAlign.center,
            maxLines: 3,
            overflow: TextOverflow.ellipsis,
            style: GoogleFonts.playfairDisplay(
              fontSize: 11,
              fontStyle: FontStyle.italic,
              color: theme.textColor,
            ),
          ),
          Text(
            _venueController.text,
            textAlign: TextAlign.center,
            maxLines: 1,
            overflow: TextOverflow.ellipsis,
            style: GoogleFonts.inter(fontSize: 9, color: theme.textMuted),
          ),
        ],
      ),
    );
  }

  // 2. Tri-fold Memorial Brochure Canvas
  Widget _buildTrifoldCanvas(MemorialThemeConfig theme) {
    return Container(
      width: 340,
      height: 280,
      padding: const EdgeInsets.all(12),
      decoration: BoxDecoration(
        color: theme.cardBg,
        borderRadius: BorderRadius.circular(16),
        border: Border.all(color: theme.borderColor, width: 2),
        boxShadow: [
          BoxShadow(color: Colors.black.withValues(alpha: 0.08), blurRadius: 16, offset: const Offset(0, 6)),
        ],
      ),
      child: Row(
        children: [
          // Panel 1: Photo & Quote
          Expanded(
            child: Container(
              padding: const EdgeInsets.all(8),
              decoration: BoxDecoration(
                border: Border(right: BorderSide(color: theme.borderColor.withValues(alpha: 0.4))),
              ),
              child: Column(
                mainAxisAlignment: MainAxisAlignment.spaceAround,
                children: [
                  Text('PANEL 1', style: GoogleFonts.inter(fontSize: 8, color: theme.accentColor, fontWeight: FontWeight.bold)),
                  ClipRRect(
                    borderRadius: BorderRadius.circular(8),
                    child: Image.network(
                      _photoUrlController.text,
                      width: 60,
                      height: 60,
                      fit: BoxFit.cover,
                      errorBuilder: (context, error, stackTrace) => Container(
                        width: 60,
                        height: 60,
                        color: theme.accentColor.withValues(alpha: 0.2),
                        child: Icon(Icons.person, size: 28, color: theme.accentColor),
                      ),
                    ),
                  ),
                  Text(_nameController.text, textAlign: TextAlign.center, style: GoogleFonts.playfairDisplay(fontSize: 11, fontWeight: FontWeight.bold, color: theme.textColor)),
                  Text(_datesController.text, textAlign: TextAlign.center, style: GoogleFonts.inter(fontSize: 8, color: theme.textMuted)),
                ],
              ),
            ),
          ),
          // Panel 2: Order of Service
          Expanded(
            child: Container(
              padding: const EdgeInsets.all(8),
              decoration: BoxDecoration(
                border: Border(right: BorderSide(color: theme.borderColor.withValues(alpha: 0.4))),
              ),
              child: Column(
                mainAxisAlignment: MainAxisAlignment.spaceAround,
                children: [
                  Text('ORDER OF SERVICE', style: GoogleFonts.inter(fontSize: 8, color: theme.accentColor, fontWeight: FontWeight.bold)),
                  Expanded(
                    child: SingleChildScrollView(
                      child: Text(_orderOfServiceController.text, style: GoogleFonts.inter(fontSize: 8, height: 1.4, color: theme.textColor)),
                    ),
                  ),
                ],
              ),
            ),
          ),
          // Panel 3: Reflections & Venue
          Expanded(
            child: Container(
              padding: const EdgeInsets.all(8),
              child: Column(
                mainAxisAlignment: MainAxisAlignment.spaceAround,
                children: [
                  Text('REFLECTIONS', style: GoogleFonts.inter(fontSize: 8, color: theme.accentColor, fontWeight: FontWeight.bold)),
                  Text(_quoteController.text, textAlign: TextAlign.center, maxLines: 5, style: GoogleFonts.playfairDisplay(fontSize: 9, fontStyle: FontStyle.italic, color: theme.textColor)),
                  Text(_venueController.text, textAlign: TextAlign.center, maxLines: 2, style: GoogleFonts.inter(fontSize: 7, color: theme.textMuted)),
                ],
              ),
            ),
          ),
        ],
      ),
    );
  }

  // 3. Prayer Keepsake Card Canvas (2.5" x 4.25")
  Widget _buildPrayerCardCanvas(MemorialThemeConfig theme) {
    if (_cardSideIndex == 1) {
      // Reverse Scripture Side
      return Container(
        width: 220,
        height: 360,
        padding: const EdgeInsets.all(18),
        decoration: BoxDecoration(
          color: theme.cardBg,
          borderRadius: BorderRadius.circular(16),
          border: Border.all(color: theme.borderColor, width: 2),
          boxShadow: [
            BoxShadow(color: Colors.black.withValues(alpha: 0.08), blurRadius: 14, offset: const Offset(0, 5)),
          ],
        ),
        child: Column(
          mainAxisAlignment: MainAxisAlignment.spaceBetween,
          children: [
            Icon(Icons.local_fire_department, color: theme.accentColor, size: 28),
            Text(
              _prayerVerseController.text,
              textAlign: TextAlign.center,
              style: GoogleFonts.playfairDisplay(
                fontSize: 13,
                fontStyle: FontStyle.italic,
                height: 1.5,
                color: theme.textColor,
              ),
            ),
            Column(
              children: [
                Text(
                  'In Loving Memory',
                  style: GoogleFonts.inter(fontSize: 9, letterSpacing: 1.5, color: theme.accentColor, fontWeight: FontWeight.bold),
                ),
                Text(
                  _nameController.text,
                  style: GoogleFonts.playfairDisplay(fontSize: 13, fontWeight: FontWeight.bold, color: theme.textColor),
                ),
              ],
            ),
          ],
        ),
      );
    }

    // Front Side
    return Container(
      width: 220,
      height: 360,
      padding: const EdgeInsets.all(18),
      decoration: BoxDecoration(
        color: theme.cardBg,
        borderRadius: BorderRadius.circular(16),
        border: Border.all(color: theme.borderColor, width: 2),
        boxShadow: [
          BoxShadow(color: Colors.black.withValues(alpha: 0.08), blurRadius: 14, offset: const Offset(0, 5)),
        ],
      ),
      child: Column(
        mainAxisAlignment: MainAxisAlignment.spaceBetween,
        children: [
          Text(
            'IN SACRED MEMORY',
            style: GoogleFonts.inter(fontSize: 8, letterSpacing: 2, fontWeight: FontWeight.bold, color: theme.accentColor),
          ),
          Container(
            width: 100,
            height: 130,
            decoration: BoxDecoration(
              borderRadius: BorderRadius.circular(50),
              border: Border.all(color: theme.borderColor, width: 2),
              image: DecorationImage(
                image: NetworkImage(_photoUrlController.text),
                fit: BoxFit.cover,
              ),
            ),
          ),
          Column(
            children: [
              Text(
                _nameController.text,
                textAlign: TextAlign.center,
                style: GoogleFonts.playfairDisplay(fontSize: 16, fontWeight: FontWeight.bold, color: theme.textColor),
              ),
              const SizedBox(height: 4),
              Text(
                _datesController.text,
                style: GoogleFonts.inter(fontSize: 10, color: theme.accentColor, fontWeight: FontWeight.bold),
              ),
            ],
          ),
          Text(
            '"Forever In Our Hearts"',
            style: GoogleFonts.playfairDisplay(fontSize: 11, fontStyle: FontStyle.italic, color: theme.textMuted),
          ),
        ],
      ),
    );
  }

  // 4. Poster / Easel Canvas (24" x 36")
  Widget _buildPosterCanvas(MemorialThemeConfig theme) {
    return Container(
      width: 260,
      height: 390,
      decoration: BoxDecoration(
        color: theme.cardBg,
        borderRadius: BorderRadius.circular(14),
        border: Border.all(color: theme.borderColor, width: 3),
        boxShadow: [
          BoxShadow(color: Colors.black.withValues(alpha: 0.1), blurRadius: 20, offset: const Offset(0, 8)),
        ],
      ),
      child: Stack(
        fit: StackFit.expand,
        children: [
          // Background Photo
          ClipRRect(
            borderRadius: BorderRadius.circular(11),
            child: Image.network(
              _photoUrlController.text,
              fit: BoxFit.cover,
              errorBuilder: (context, error, stackTrace) => Container(
                color: theme.primaryColor,
                child: Center(
                  child: Icon(Icons.person, size: 64, color: theme.accentColor),
                ),
              ),
            ),
          ),
          // Gradient Overlay
          Container(
            decoration: BoxDecoration(
              borderRadius: BorderRadius.circular(11),
              gradient: LinearGradient(
                begin: Alignment.topCenter,
                end: Alignment.bottomCenter,
                colors: [
                  Colors.black.withValues(alpha: 0.3),
                  Colors.black.withValues(alpha: 0.8),
                ],
              ),
            ),
          ),
          // Poster Typography
          Padding(
            padding: const EdgeInsets.all(20),
            child: Column(
              mainAxisAlignment: MainAxisAlignment.spaceBetween,
              children: [
                Text(
                  'A CELEBRATION OF LIFE',
                  style: GoogleFonts.inter(fontSize: 10, letterSpacing: 3, fontWeight: FontWeight.bold, color: Colors.amber.shade300),
                ),
                Column(
                  children: [
                    Text(
                      _nameController.text,
                      textAlign: TextAlign.center,
                      style: GoogleFonts.playfairDisplay(
                        fontSize: 24,
                        fontWeight: FontWeight.bold,
                        color: Colors.white,
                      ),
                    ),
                    const SizedBox(height: 6),
                    Text(
                      _datesController.text,
                      style: GoogleFonts.inter(fontSize: 12, fontWeight: FontWeight.bold, color: Colors.amber.shade200),
                    ),
                    const SizedBox(height: 12),
                    Text(
                      _quoteController.text,
                      textAlign: TextAlign.center,
                      maxLines: 2,
                      style: GoogleFonts.playfairDisplay(fontSize: 11, fontStyle: FontStyle.italic, color: Colors.white70),
                    ),
                  ],
                ),
              ],
            ),
          ),
        ],
      ),
    );
  }

  // 5. Bookmark Canvas (2" x 8")
  Widget _buildBookmarkCanvas(MemorialThemeConfig theme) {
    return Container(
      width: 140,
      height: 380,
      padding: const EdgeInsets.symmetric(horizontal: 14, vertical: 20),
      decoration: BoxDecoration(
        color: theme.cardBg,
        borderRadius: BorderRadius.circular(12),
        border: Border.all(color: theme.borderColor, width: 2),
        boxShadow: [
          BoxShadow(color: Colors.black.withValues(alpha: 0.08), blurRadius: 14, offset: const Offset(0, 4)),
        ],
      ),
      child: Column(
        mainAxisAlignment: MainAxisAlignment.spaceBetween,
        children: [
          Container(
            width: 16,
            height: 16,
            decoration: BoxDecoration(
              shape: BoxShape.circle,
              color: theme.accentColor,
            ),
          ),
          ClipRRect(
            borderRadius: BorderRadius.circular(30),
            child: Image.network(
              _photoUrlController.text,
              width: 60,
              height: 60,
              fit: BoxFit.cover,
              errorBuilder: (context, error, stackTrace) => Container(
                width: 60,
                height: 60,
                color: theme.accentColor.withValues(alpha: 0.2),
                child: Icon(Icons.person, size: 28, color: theme.accentColor),
              ),
            ),
          ),
          Text(
            _nameController.text,
            textAlign: TextAlign.center,
            style: GoogleFonts.playfairDisplay(fontSize: 14, fontWeight: FontWeight.bold, color: theme.textColor),
          ),
          Text(
            _datesController.text,
            textAlign: TextAlign.center,
            style: GoogleFonts.inter(fontSize: 9, color: theme.accentColor, fontWeight: FontWeight.bold),
          ),
          Text(
            _quoteController.text,
            textAlign: TextAlign.center,
            maxLines: 4,
            style: GoogleFonts.playfairDisplay(fontSize: 10, fontStyle: FontStyle.italic, color: theme.textColor),
          ),
          Text(
            'Always In Our Hearts',
            style: GoogleFonts.inter(fontSize: 8, letterSpacing: 1, color: theme.textMuted),
          ),
        ],
      ),
    );
  }

  // 6. 5" x 7" Funeral & Memorial Invitation Canvas
  Widget _buildInvitationCanvas(MemorialThemeConfig theme) {
    return Container(
      width: 270,
      height: 380,
      padding: const EdgeInsets.all(22),
      decoration: BoxDecoration(
        color: theme.cardBg,
        borderRadius: BorderRadius.circular(16),
        border: Border.all(color: theme.borderColor, width: 2),
        boxShadow: [
          BoxShadow(color: Colors.black.withValues(alpha: 0.08), blurRadius: 16, offset: const Offset(0, 6)),
        ],
      ),
      child: Column(
        mainAxisAlignment: MainAxisAlignment.spaceBetween,
        children: [
          Column(
            children: [
              Text(
                'IN LOVING REMEMBRANCE',
                style: GoogleFonts.inter(
                  fontSize: 9,
                  letterSpacing: 2.2,
                  fontWeight: FontWeight.bold,
                  color: theme.accentColor,
                ),
              ),
              const SizedBox(height: 6),
              Text(
                'You are warmly invited to celebrate the life of',
                textAlign: TextAlign.center,
                style: GoogleFonts.inter(fontSize: 10, color: theme.textMuted),
              ),
            ],
          ),
          ClipRRect(
            borderRadius: BorderRadius.circular(50),
            child: Image.network(
              _photoUrlController.text,
              width: 84,
              height: 84,
              fit: BoxFit.cover,
              errorBuilder: (context, error, stackTrace) => Container(
                width: 84,
                height: 84,
                color: theme.accentColor.withValues(alpha: 0.2),
                child: Icon(Icons.person, size: 36, color: theme.accentColor),
              ),
            ),
          ),
          Column(
            children: [
              Text(
                _nameController.text,
                textAlign: TextAlign.center,
                style: GoogleFonts.playfairDisplay(
                  fontSize: 17,
                  fontWeight: FontWeight.bold,
                  color: theme.textColor,
                ),
              ),
              const SizedBox(height: 4),
              Text(
                _datesController.text,
                style: GoogleFonts.inter(fontSize: 10, color: theme.accentColor, fontWeight: FontWeight.bold),
              ),
            ],
          ),
          Container(
            padding: const EdgeInsets.symmetric(horizontal: 12, vertical: 8),
            decoration: BoxDecoration(
              color: theme.primaryColor.withValues(alpha: 0.05),
              borderRadius: BorderRadius.circular(10),
            ),
            child: Column(
              children: [
                Text(
                  _venueController.text,
                  textAlign: TextAlign.center,
                  maxLines: 2,
                  style: GoogleFonts.inter(fontSize: 9, fontWeight: FontWeight.w600, color: theme.textColor),
                ),
                const SizedBox(height: 3),
                Text(
                  'Reception to follow immediately after the ceremony.',
                  textAlign: TextAlign.center,
                  style: GoogleFonts.inter(fontSize: 8, color: theme.textMuted),
                ),
              ],
            ),
          ),
        ],
      ),
    );
  }

  // 7. 4" x 6" Gratitude & Thank You Card Canvas
  Widget _buildThankYouCanvas(MemorialThemeConfig theme) {
    return Container(
      width: 320,
      height: 230,
      padding: const EdgeInsets.all(20),
      decoration: BoxDecoration(
        color: theme.cardBg,
        borderRadius: BorderRadius.circular(16),
        border: Border.all(color: theme.borderColor, width: 2),
        boxShadow: [
          BoxShadow(color: Colors.black.withValues(alpha: 0.08), blurRadius: 16, offset: const Offset(0, 6)),
        ],
      ),
      child: Column(
        mainAxisAlignment: MainAxisAlignment.spaceBetween,
        children: [
          Text(
            'WITH SINCERE GRATITUDE',
            style: GoogleFonts.inter(
              fontSize: 10,
              letterSpacing: 2.5,
              fontWeight: FontWeight.bold,
              color: theme.accentColor,
            ),
          ),
          Text(
            'The family of ${_nameController.text} gratefully acknowledges your kind expressions of sympathy, prayers, flowers, and comforting support during this time of sorrow.',
            textAlign: TextAlign.center,
            style: GoogleFonts.playfairDisplay(
              fontSize: 12,
              fontStyle: FontStyle.italic,
              height: 1.5,
              color: theme.textColor,
            ),
          ),
          Text(
            '— The Cherished Family & Friends',
            style: GoogleFonts.inter(
              fontSize: 10,
              fontWeight: FontWeight.bold,
              color: theme.accentColor,
            ),
          ),
        ],
      ),
    );
  }

  // =========================================================================
  // TAB CONTROLLERS
  // =========================================================================

  Widget _buildTab1Honoree() {
    return Container(
      padding: const EdgeInsets.all(16),
      decoration: BoxDecoration(
        color: Colors.white,
        borderRadius: BorderRadius.circular(16),
        border: Border.all(color: AppColors.borderSubtle),
      ),
      child: SingleChildScrollView(
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            _buildField('Honoree Full Name', _nameController),
            const SizedBox(height: 12),
            _buildField('Lifespan Dates', _datesController, hint: 'March 15, 1942 – January 12, 2026'),
            const SizedBox(height: 12),
            _buildField('Memorial Quote / Tribute', _quoteController, maxLines: 2),
            const SizedBox(height: 12),
            _buildField('Portrait Photo URL', _photoUrlController),
          ],
        ),
      ),
    );
  }

  Widget _buildTab2ProductDetails() {
    return Container(
      padding: const EdgeInsets.all(16),
      decoration: BoxDecoration(
        color: Colors.white,
        borderRadius: BorderRadius.circular(16),
        border: Border.all(color: AppColors.borderSubtle),
      ),
      child: SingleChildScrollView(
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            if (_selectedProductType == 'cards') ...[
              Text(
                'Scripture & Sacred Prayer Preset',
                style: GoogleFonts.inter(fontSize: 12, fontWeight: FontWeight.bold, color: AppColors.textDark),
              ),
              const SizedBox(height: 8),
              ..._prayerPresets.map((p) => Padding(
                    padding: const EdgeInsets.only(bottom: 6),
                    child: InkWell(
                      onTap: () {
                        setState(() => _prayerVerseController.text = p);
                        _syncWithGlobalState();
                      },
                      child: Container(
                        padding: const EdgeInsets.all(10),
                        decoration: BoxDecoration(
                          color: _prayerVerseController.text == p ? AppColors.accent.withValues(alpha: 0.12) : AppColors.bgSurface,
                          borderRadius: BorderRadius.circular(10),
                        ),
                        child: Text(p, maxLines: 2, overflow: TextOverflow.ellipsis, style: GoogleFonts.inter(fontSize: 11)),
                      ),
                    ),
                  )),
              const SizedBox(height: 10),
              _buildField('Custom Prayer / Scripture Text', _prayerVerseController, maxLines: 3),
            ] else ...[
              _buildField('Order of Service Schedule', _orderOfServiceController, maxLines: 6),
            ],
          ],
        ),
      ),
    );
  }

  Widget _buildTab3Ceremony() {
    return Container(
      padding: const EdgeInsets.all(16),
      decoration: BoxDecoration(
        color: Colors.white,
        borderRadius: BorderRadius.circular(16),
        border: Border.all(color: AppColors.borderSubtle),
      ),
      child: SingleChildScrollView(
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            _buildField('Service Venue & Location', _venueController),
            const SizedBox(height: 12),
            _buildField('Honorary Pallbearers', _pallbearersController, hint: 'David Vance, Marcus Lee...'),
          ],
        ),
      ),
    );
  }

  Widget _buildField(String label, TextEditingController controller, {int maxLines = 1, String? hint}) {
    return Column(
      crossAxisAlignment: CrossAxisAlignment.start,
      children: [
        Text(
          label,
          style: GoogleFonts.inter(fontSize: 12, fontWeight: FontWeight.w600, color: AppColors.textDark),
        ),
        const SizedBox(height: 6),
        TextField(
          controller: controller,
          maxLines: maxLines,
          onChanged: (_) {
            setState(() {});
            _syncWithGlobalState();
          },
          decoration: InputDecoration(
            hintText: hint,
            filled: true,
            fillColor: AppColors.bgSurface,
            contentPadding: const EdgeInsets.symmetric(horizontal: 14, vertical: 12),
            border: OutlineInputBorder(borderRadius: BorderRadius.circular(12), borderSide: BorderSide.none),
          ),
        ),
      ],
    );
  }

  String _getProductName(String id) {
    final found = _productTypes.firstWhere(
      (p) => p['id'] == id,
      orElse: () => {'label': 'Funeral Stationery Program'},
    );
    return (found['label'] ?? found['title'] ?? 'Funeral Stationery Program') as String;
  }
}

