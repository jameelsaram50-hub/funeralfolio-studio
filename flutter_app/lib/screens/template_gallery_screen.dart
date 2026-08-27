import 'package:flutter/material.dart';
import 'package:google_fonts/google_fonts.dart';
import '../theme/app_theme.dart';
import '../models/models.dart';
import '../constants/app_constants.dart';
import '../services/memorial_state_service.dart';
import 'prayer_card_editor_screen.dart';
import 'invitation_editor_screen.dart';
import 'thank_you_editor_screen.dart';
import '../widgets/app_navbar.dart';

class TemplateGalleryScreen extends StatefulWidget {
  final String initialCategory;
  final String initialProductType;

  const TemplateGalleryScreen({
    super.key,
    this.initialCategory = 'All',
    this.initialProductType = 'cards',
  });

  @override
  State<TemplateGalleryScreen> createState() => _TemplateGalleryScreenState();
}

class _TemplateGalleryScreenState extends State<TemplateGalleryScreen> {
  late String _selectedProduct;
  late String _selectedCategory;
  String _searchQuery = '';

  final List<Map<String, dynamic>> _productTypes = [
    {
      'id': 'cards',
      'name': 'Prayer Cards',
      'desc': '2.5" x 4.25" Keepsake Pocket Cards',
      'icon': Icons.favorite_border,
    },
    {
      'id': 'invitation',
      'name': 'Invitations',
      'desc': '5" x 7" Memorial Announcements',
      'icon': Icons.mail_outline,
    },
    {
      'id': 'thank-you',
      'name': 'Thank You',
      'desc': '4" x 6" Family Gratitude Cards',
      'icon': Icons.volunteer_activism_outlined,
    },
  ];

  final List<String> _categories = [
    'All',
    'Floral',
    'Modern',
    'Classic',
    'Nature',
    'Religious',
  ];

  @override
  void initState() {
    super.initState();
    _selectedCategory = widget.initialCategory;
    _selectedProduct = widget.initialProductType;
  }

  @override
  Widget build(BuildContext context) {
    final allTemplates = AppConstants.templates;
    final filtered = allTemplates.where((t) {
      final matchesCategory = _selectedCategory == 'All' || t.category == _selectedCategory;
      final matchesSearch = _searchQuery.isEmpty ||
          t.title.toLowerCase().contains(_searchQuery.toLowerCase()) ||
          t.description.toLowerCase().contains(_searchQuery.toLowerCase()) ||
          t.category.toLowerCase().contains(_searchQuery.toLowerCase());
      return matchesCategory && matchesSearch;
    }).toList();

    return Scaffold(
      backgroundColor: AppColors.bgMain,
      appBar: const AppNavbar(activeRoute: '/gallery'),
      drawer: const AppDrawer(),
      body: Column(
        children: [
          // 1. PRODUCT TYPE SELECTOR
          Container(
            color: Colors.white,
            padding: const EdgeInsets.symmetric(vertical: 8),
            child: SingleChildScrollView(
              scrollDirection: Axis.horizontal,
              padding: const EdgeInsets.symmetric(horizontal: 16),
              child: Row(
                children: _productTypes.map((prod) {
                  final isSelected = _selectedProduct == prod['id'];
                  return Padding(
                    padding: const EdgeInsets.only(right: 8),
                    child: InkWell(
                      onTap: () => setState(() => _selectedProduct = prod['id']),
                      borderRadius: BorderRadius.circular(14),
                      child: Container(
                        padding: const EdgeInsets.symmetric(horizontal: 14, vertical: 8),
                        decoration: BoxDecoration(
                          color: isSelected ? AppColors.primary : AppColors.bgSurface,
                          borderRadius: BorderRadius.circular(14),
                          border: Border.all(
                            color: isSelected ? AppColors.primary : AppColors.borderSubtle,
                          ),
                        ),
                        child: Row(
                          mainAxisSize: MainAxisSize.min,
                          children: [
                            Icon(
                              prod['icon'] as IconData,
                              size: 16,
                              color: isSelected ? AppColors.accent : AppColors.textDark,
                            ),
                            const SizedBox(width: 8),
                            Text(
                              prod['name'] as String,
                              style: GoogleFonts.inter(
                                fontSize: 12,
                                fontWeight: FontWeight.bold,
                                color: isSelected ? Colors.white : AppColors.textDark,
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

          // 2. SEARCH & THEME CATEGORY FILTER
          Padding(
            padding: const EdgeInsets.fromLTRB(16, 12, 16, 6),
            child: TextField(
              onChanged: (val) => setState(() => _searchQuery = val),
              decoration: InputDecoration(
                hintText: 'Search templates by name, style, motif...',
                prefixIcon: const Icon(Icons.search, size: 18, color: AppColors.textMuted),
                filled: true,
                fillColor: Colors.white,
                contentPadding: const EdgeInsets.symmetric(horizontal: 16, vertical: 10),
                border: OutlineInputBorder(
                  borderRadius: BorderRadius.circular(16),
                  borderSide: const BorderSide(color: AppColors.borderSubtle),
                ),
                enabledBorder: OutlineInputBorder(
                  borderRadius: BorderRadius.circular(16),
                  borderSide: const BorderSide(color: AppColors.borderSubtle),
                ),
              ),
            ),
          ),

          // Style Category Chips
          SingleChildScrollView(
            scrollDirection: Axis.horizontal,
            padding: const EdgeInsets.symmetric(horizontal: 16, vertical: 6),
            child: Row(
              children: _categories.map((cat) {
                final isSelected = _selectedCategory == cat;
                return Padding(
                  padding: const EdgeInsets.only(right: 8),
                  child: ChoiceChip(
                    label: Text(cat),
                    selected: isSelected,
                    selectedColor: AppColors.accent,
                    backgroundColor: Colors.white,
                    labelStyle: GoogleFonts.inter(
                      color: isSelected ? AppColors.primary : AppColors.textDark,
                      fontWeight: FontWeight.bold,
                      fontSize: 12,
                    ),
                    shape: RoundedRectangleBorder(
                      borderRadius: BorderRadius.circular(20),
                      side: BorderSide(
                        color: isSelected ? AppColors.accent : AppColors.borderSubtle,
                      ),
                    ),
                    onSelected: (selected) {
                      if (selected) setState(() => _selectedCategory = cat);
                    },
                  ),
                );
              }).toList(),
            ),
          ),

          const SizedBox(height: 6),

          // 3. TEMPLATES GRID
          Expanded(
            child: filtered.isEmpty
                ? Center(
                    child: Text(
                      'No templates match your search.',
                      style: GoogleFonts.inter(color: AppColors.textMuted),
                    ),
                  )
                : GridView.builder(
                    padding: const EdgeInsets.all(16),
                    gridDelegate: const SliverGridDelegateWithMaxCrossAxisExtent(
                      maxCrossAxisExtent: 380,
                      mainAxisExtent: 340,
                      crossAxisSpacing: 16,
                      mainAxisSpacing: 16,
                    ),
                    itemCount: filtered.length,
                    itemBuilder: (context, index) {
                      final item = filtered[index];
                      return _buildTemplateCard(context, item);
                    },
                  ),
          ),
        ],
      ),
    );
  }

  Widget _buildTemplateCard(BuildContext context, TemplateItem item) {
    return Container(
      decoration: BoxDecoration(
        color: Colors.white,
        borderRadius: BorderRadius.circular(20),
        border: Border.all(color: AppColors.borderSubtle),
        boxShadow: [
          BoxShadow(
            color: Colors.black.withValues(alpha: 0.04),
            blurRadius: 12,
            offset: const Offset(0, 4),
          ),
        ],
      ),
      child: ClipRRect(
        borderRadius: BorderRadius.circular(20),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            // Image Preview
            Expanded(
              child: Stack(
                children: [
                  Positioned.fill(
                    child: Image.network(
                      item.imageUrl,
                      fit: BoxFit.cover,
                      errorBuilder: (context, error, stackTrace) => Container(
                        color: AppColors.bgSurface,
                        child: const Center(
                          child: Icon(Icons.image_outlined, color: AppColors.accent, size: 48),
                        ),
                      ),
                    ),
                  ),
                  Positioned(
                    top: 12,
                    left: 12,
                    child: Container(
                      padding: const EdgeInsets.symmetric(horizontal: 10, vertical: 4),
                      decoration: BoxDecoration(
                        color: Colors.black.withValues(alpha: 0.65),
                        borderRadius: BorderRadius.circular(20),
                      ),
                      child: Text(
                        item.category.toUpperCase(),
                        style: GoogleFonts.inter(
                          fontSize: 10,
                          fontWeight: FontWeight.bold,
                          color: Colors.white,
                          letterSpacing: 1,
                        ),
                      ),
                    ),
                  ),
                ],
              ),
            ),

            // Card Body
            Padding(
              padding: const EdgeInsets.all(14),
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  Text(
                    item.title,
                    maxLines: 1,
                    overflow: TextOverflow.ellipsis,
                    style: GoogleFonts.playfairDisplay(
                      fontSize: 16,
                      fontWeight: FontWeight.bold,
                      color: AppColors.textDark,
                    ),
                  ),
                  const SizedBox(height: 2),
                  Text(
                    item.tradition,
                    style: GoogleFonts.inter(
                      fontSize: 11,
                      color: AppColors.accent,
                      fontWeight: FontWeight.w600,
                    ),
                  ),
                  const SizedBox(height: 6),
                  Text(
                    item.description,
                    maxLines: 2,
                    overflow: TextOverflow.ellipsis,
                    style: GoogleFonts.inter(
                      fontSize: 11,
                      color: AppColors.textMuted,
                      height: 1.3,
                    ),
                  ),
                  const SizedBox(height: 12),
                  SizedBox(
                    width: double.infinity,
                    child: ElevatedButton(
                      onPressed: () {
                        // Persist theme to global state
                        MemorialStateService.instance.updateDraft(
                          themeId: item.defaultThemeId,
                          productId: _selectedProduct,
                        );

                        Widget targetScreen;
                        if (_selectedProduct == 'cards') {
                          targetScreen = PrayerCardEditorScreen(
                            initialThemeId: item.defaultThemeId,
                          );
                        } else if (_selectedProduct == 'invitation') {
                          targetScreen = InvitationEditorScreen(
                            initialThemeId: item.defaultThemeId,
                          );
                        } else if (_selectedProduct == 'thank-you') {
                          targetScreen = ThankYouEditorScreen(
                            initialThemeId: item.defaultThemeId,
                          );
                        } else {
                          targetScreen = PrayerCardEditorScreen(
                            initialThemeId: item.defaultThemeId,
                          );
                        }

                        Navigator.push(
                          context,
                          MaterialPageRoute(builder: (context) => targetScreen),
                        );
                      },
                      style: ElevatedButton.styleFrom(
                        backgroundColor: AppColors.primary,
                        foregroundColor: Colors.white,
                        padding: const EdgeInsets.symmetric(vertical: 10),
                        shape: RoundedRectangleBorder(
                          borderRadius: BorderRadius.circular(12),
                        ),
                      ),
                      child: Text(
                        'Customize This Design',
                        style: GoogleFonts.inter(
                          fontSize: 12,
                          fontWeight: FontWeight.bold,
                        ),
                      ),
                    ),
                  ),
                ],
              ),
            ),
          ],
        ),
      ),
    );
  }
}
