import 'package:flutter/material.dart';
import 'package:google_fonts/google_fonts.dart';
import '../theme/app_theme.dart';
import '../services/memorial_state_service.dart';
import 'checkout_screen.dart';

class PrayerCardEditorScreen extends StatefulWidget {
  final String? initialThemeId;

  const PrayerCardEditorScreen({
    super.key,
    this.initialThemeId,
  });

  @override
  State<PrayerCardEditorScreen> createState() => _PrayerCardEditorScreenState();
}

class _PrayerCardEditorScreenState extends State<PrayerCardEditorScreen> {
  int _currentStep = 1;
  String _previewSide = 'front'; // 'front' | 'back'
  late String _selectedThemeId;

  late TextEditingController _nameController;
  late TextEditingController _birthDateController;
  late TextEditingController _deathDateController;
  late TextEditingController _prayerVerseController;
  late TextEditingController _photoUrlController;

  final List<Map<String, String>> _prayerPresets = [
    {
      'title': 'The 23rd Psalm',
      'verse': 'The Lord is my shepherd; I shall not want.\nHe maketh me to lie down in green pastures:\nHe leadeth me beside the still waters.\nHe restoreth my soul.\nYea, though I walk through the valley of the shadow of death,\nI will fear no evil: for thou art with me;\nThy rod and thy staff they comfort me.',
    },
    {
      'title': 'Traditional Irish Blessing',
      'verse': 'May the road rise up to meet you.\nMay the wind be always at your back.\nMay the sun shine warm upon your face;\nthe rains fall soft upon your fields and until we meet again,\nmay God hold you in the palm of His hand.',
    },
    {
      'title': 'The Lord\'s Prayer',
      'verse': 'Our Father, who art in heaven, hallowed be thy name;\nthy kingdom come; thy will be done on earth as it is in heaven.\nGive us this day our daily bread;\nand forgive us our trespasses as we forgive those who trespass against us;\nand lead us not into temptation, but deliver us from evil.\nAmen.',
    },
    {
      'title': 'Do Not Stand at My Grave and Weep',
      'verse': 'Do not stand at my grave and weep;\nI am not there. I do not sleep.\nI am a thousand winds that blow,\nI am the diamond glints on snow,\nI am the sunlight on ripened grain,\nI am the gentle autumn rain.',
    },
  ];

  @override
  void initState() {
    super.initState();
    final draft = MemorialStateService.instance.draft;
    _selectedThemeId = widget.initialThemeId ?? draft.themeId ?? 'celestial-gold';

    _nameController = TextEditingController(text: draft.name);
    _birthDateController = TextEditingController(text: draft.birthDate ?? '1942');
    _deathDateController = TextEditingController(text: draft.deathDate ?? '2026');
    _prayerVerseController = TextEditingController(text: draft.prayerVerse ?? _prayerPresets[0]['verse']);
    _photoUrlController = TextEditingController(text: draft.photoUrl ?? 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?q=80&w=600&auto=format&fit=crop');
  }

  void _syncToState() {
    MemorialStateService.instance.updateDraft(
      name: _nameController.text,
      birthDate: _birthDateController.text,
      deathDate: _deathDateController.text,
      prayerVerse: _prayerVerseController.text,
      photoUrl: _photoUrlController.text,
      themeId: _selectedThemeId,
      productId: 'cards',
    );
  }

  @override
  void dispose() {
    _nameController.dispose();
    _birthDateController.dispose();
    _deathDateController.dispose();
    _prayerVerseController.dispose();
    _photoUrlController.dispose();
    super.dispose();
  }

  @override
  Widget build(BuildContext context) {
    final theme = MemorialThemes.getById(_selectedThemeId);

    return Scaffold(
      backgroundColor: AppColors.bgMain,
      appBar: AppBar(
        title: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            Text(
              'Customizing Prayer Card (2.5" x 4.25")',
              style: GoogleFonts.playfairDisplay(fontSize: 16, fontWeight: FontWeight.bold),
            ),
            Row(
              children: [
                Text(
                  '${theme.name} Theme • ',
                  style: GoogleFonts.inter(fontSize: 11, color: AppColors.textMuted),
                ),
                GestureDetector(
                  onTap: _showThemePickerModal,
                  child: Text(
                    'Change Theme',
                    style: GoogleFonts.inter(
                      fontSize: 11,
                      fontWeight: FontWeight.bold,
                      color: AppColors.accent,
                      decoration: TextDecoration.underline,
                    ),
                  ),
                ),
              ],
            ),
          ],
        ),
        actions: [
          TextButton(
            onPressed: () => Navigator.pop(context),
            child: Text('CANCEL', style: GoogleFonts.inter(fontSize: 11, fontWeight: FontWeight.bold, color: AppColors.textMuted)),
          ),
          Padding(
            padding: const EdgeInsets.only(right: 12),
            child: ElevatedButton(
              onPressed: () {
                _syncToState();
                Navigator.push(
                  context,
                  MaterialPageRoute(builder: (context) => const CheckoutScreen()),
                );
              },
              style: ElevatedButton.styleFrom(
                backgroundColor: AppColors.primary,
                foregroundColor: Colors.white,
                shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(10)),
                padding: const EdgeInsets.symmetric(horizontal: 16, vertical: 8),
              ),
              child: Text('Finalize', style: GoogleFonts.inter(fontWeight: FontWeight.bold, fontSize: 12)),
            ),
          ),
        ],
      ),
      body: LayoutBuilder(
        builder: (context, constraints) {
          final isWide = constraints.maxWidth >= 850;

          if (isWide) {
            return Row(
              children: [
                Expanded(
                  flex: 5,
                  child: Container(
                    padding: const EdgeInsets.all(24),
                    child: _buildLiveCardPreview(theme, isWide: true),
                  ),
                ),
                Expanded(
                  flex: 5,
                  child: Container(
                    margin: const EdgeInsets.fromLTRB(0, 16, 20, 16),
                    decoration: BoxDecoration(
                      color: Colors.white,
                      borderRadius: BorderRadius.circular(24),
                      border: Border.all(color: AppColors.borderSubtle),
                    ),
                    child: _buildStepForm(),
                  ),
                ),
              ],
            );
          }

          return SingleChildScrollView(
            padding: const EdgeInsets.all(16),
            child: Column(
              children: [
                _buildLiveCardPreview(theme, isWide: false),
                const SizedBox(height: 20),
                Container(
                  padding: const EdgeInsets.all(18),
                  decoration: BoxDecoration(
                    color: Colors.white,
                    borderRadius: BorderRadius.circular(20),
                    border: Border.all(color: AppColors.borderSubtle),
                  ),
                  child: _buildStepForm(),
                ),
              ],
            ),
          );
        },
      ),
    );
  }

  Widget _buildLiveCardPreview(MemorialThemeConfig theme, {bool isWide = false}) {
    final cardContent = Container(
      width: 260,
      height: 420,
      padding: const EdgeInsets.all(20),
      decoration: BoxDecoration(
        color: theme.cardBg,
        borderRadius: BorderRadius.circular(16),
        border: Border.all(color: theme.accentColor, width: 2),
        boxShadow: [
          BoxShadow(
            color: Colors.black.withValues(alpha: 0.12),
            blurRadius: 18,
            offset: const Offset(0, 6),
          ),
        ],
      ),
      child: _previewSide == 'front'
                ? Column(
                    mainAxisAlignment: MainAxisAlignment.center,
                    children: [
                      Text(
                        'IN LOVING MEMORY',
                        style: GoogleFonts.playfairDisplay(
                          fontSize: 12,
                          letterSpacing: 2,
                          fontWeight: FontWeight.bold,
                          color: theme.accentColor,
                        ),
                      ),
                      const SizedBox(height: 16),
                      Container(
                        width: 110,
                        height: 110,
                        decoration: BoxDecoration(
                          shape: BoxShape.circle,
                          border: Border.all(color: theme.accentColor, width: 2.5),
                        ),
                        child: ClipOval(
                          child: _photoUrlController.text.isNotEmpty
                              ? Image.network(
                                  _photoUrlController.text,
                                  fit: BoxFit.cover,
                                  errorBuilder: (context, error, stackTrace) => Icon(Icons.person, size: 50, color: theme.accentColor),
                                )
                              : Icon(Icons.person, size: 50, color: theme.accentColor),
                        ),
                      ),
                      const SizedBox(height: 16),
                      Text(
                        _nameController.text.isNotEmpty ? _nameController.text : 'Honoree Name',
                        textAlign: TextAlign.center,
                        style: GoogleFonts.playfairDisplay(
                          fontSize: 18,
                          fontWeight: FontWeight.bold,
                          color: theme.textColor,
                        ),
                      ),
                      const SizedBox(height: 4),
                      Text(
                        '${_birthDateController.text} — ${_deathDateController.text}',
                        style: GoogleFonts.inter(fontSize: 12, color: theme.textColor.withValues(alpha: 0.8)),
                      ),
                      const SizedBox(height: 12),
                      Text(
                        'Forever In Our Hearts',
                        style: GoogleFonts.playfairDisplay(
                          fontSize: 11,
                          fontStyle: FontStyle.italic,
                          color: theme.accentColor,
                        ),
                      ),
                    ],
                  )
                : Column(
                    mainAxisAlignment: MainAxisAlignment.center,
                    children: [
                      Icon(Icons.menu_book, color: theme.accentColor, size: 24),
                      const SizedBox(height: 12),
                      Expanded(
                        child: SingleChildScrollView(
                          child: Text(
                            _prayerVerseController.text,
                            textAlign: TextAlign.center,
                            style: GoogleFonts.playfairDisplay(
                              fontSize: 11,
                              height: 1.5,
                              fontStyle: FontStyle.italic,
                              color: theme.textColor,
                            ),
                          ),
                        ),
                      ),
                    ],
                  ),
    );

    if (isWide) {
      return Column(
        children: [
          Row(
            mainAxisAlignment: MainAxisAlignment.center,
            children: [
              _buildSideButton('front', 'Front (Portrait)'),
              const SizedBox(width: 10),
              _buildSideButton('back', 'Back (Scripture)'),
            ],
          ),
          const SizedBox(height: 16),
          Expanded(
            child: Center(
              child: FittedBox(
                fit: BoxFit.contain,
                child: cardContent,
              ),
            ),
          ),
        ],
      );
    }

    return Column(
      children: [
        Row(
          mainAxisAlignment: MainAxisAlignment.center,
          children: [
            _buildSideButton('front', 'Front (Portrait)'),
            const SizedBox(width: 10),
            _buildSideButton('back', 'Back (Scripture)'),
          ],
        ),
        const SizedBox(height: 16),
        Center(
          child: FittedBox(
            fit: BoxFit.contain,
            child: cardContent,
          ),
        ),
      ],
    );
  }

  Widget _buildSideButton(String side, String label) {
    final isSelected = _previewSide == side;
    return InkWell(
      onTap: () => setState(() => _previewSide = side),
      borderRadius: BorderRadius.circular(10),
      child: Container(
        padding: const EdgeInsets.symmetric(horizontal: 16, vertical: 8),
        decoration: BoxDecoration(
          color: isSelected ? AppColors.primary : Colors.white,
          borderRadius: BorderRadius.circular(10),
          border: Border.all(color: isSelected ? AppColors.primary : AppColors.borderSubtle),
        ),
        child: Text(
          label,
          style: GoogleFonts.inter(
            fontSize: 11,
            fontWeight: FontWeight.bold,
            color: isSelected ? Colors.white : AppColors.textDark,
          ),
        ),
      ),
    );
  }

  Widget _buildStepForm() {
    return Padding(
      padding: const EdgeInsets.all(20),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          Text(
            _currentStep == 1 ? 'Step 1: Honoree Details & Photo' : 'Step 2: Choose Prayer / Scripture',
            style: GoogleFonts.playfairDisplay(fontSize: 16, fontWeight: FontWeight.bold),
          ),
          const SizedBox(height: 16),
          Expanded(
            child: SingleChildScrollView(
              child: _currentStep == 1
                  ? Column(
                      children: [
                        _buildTextField('Honoree Full Name', _nameController),
                        const SizedBox(height: 12),
                        Row(
                          children: [
                            Expanded(child: _buildTextField('Date of Birth', _birthDateController)),
                            const SizedBox(width: 10),
                            Expanded(child: _buildTextField('Date of Passing', _deathDateController)),
                          ],
                        ),
                        const SizedBox(height: 12),
                        _buildTextField('Portrait Image URL', _photoUrlController),
                      ],
                    )
                  : Column(
                      crossAxisAlignment: CrossAxisAlignment.start,
                      children: [
                        Text('Select Scripture Preset:', style: GoogleFonts.inter(fontSize: 12, fontWeight: FontWeight.bold)),
                        const SizedBox(height: 8),
                        Wrap(
                          spacing: 8,
                          runSpacing: 8,
                          children: _prayerPresets.map((p) {
                            return ActionChip(
                              label: Text(p['title']!, style: GoogleFonts.inter(fontSize: 11)),
                              onPressed: () {
                                setState(() => _prayerVerseController.text = p['verse']!);
                              },
                            );
                          }).toList(),
                        ),
                        const SizedBox(height: 14),
                        _buildTextField('Custom Prayer / Poem Text', _prayerVerseController, maxLines: 6),
                      ],
                    ),
            ),
          ),
          const SizedBox(height: 14),
          Row(
            mainAxisAlignment: MainAxisAlignment.spaceBetween,
            children: [
              if (_currentStep > 1)
                OutlinedButton(
                  onPressed: () => setState(() => _currentStep = 1),
                  child: const Text('Back'),
                )
              else
                const SizedBox.shrink(),
              ElevatedButton(
                onPressed: () {
                  _syncToState();
                  if (_currentStep == 1) {
                    setState(() => _currentStep = 2);
                  } else {
                    Navigator.push(
                      context,
                      MaterialPageRoute(builder: (context) => const CheckoutScreen()),
                    );
                  }
                },
                style: ElevatedButton.styleFrom(
                  backgroundColor: AppColors.primary,
                  foregroundColor: Colors.white,
                  padding: const EdgeInsets.symmetric(horizontal: 24, vertical: 12),
                  shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(12)),
                ),
                child: Text(_currentStep == 1 ? 'Next: Choose Prayer' : 'Finalize & Order Prints'),
              ),
            ],
          ),
        ],
      ),
    );
  }

  Widget _buildTextField(String label, TextEditingController controller, {int maxLines = 1}) {
    return Column(
      crossAxisAlignment: CrossAxisAlignment.start,
      children: [
        Text(label, style: GoogleFonts.inter(fontSize: 12, fontWeight: FontWeight.w600, color: AppColors.textDark)),
        const SizedBox(height: 6),
        TextField(
          controller: controller,
          maxLines: maxLines,
          style: GoogleFonts.inter(fontSize: 13),
          decoration: InputDecoration(
            filled: true,
            fillColor: AppColors.bgSurface,
            contentPadding: const EdgeInsets.symmetric(horizontal: 14, vertical: 12),
            border: OutlineInputBorder(
              borderRadius: BorderRadius.circular(12),
              borderSide: const BorderSide(color: AppColors.borderSubtle),
            ),
          ),
          onChanged: (_) => setState(() {}),
        ),
      ],
    );
  }

  void _showThemePickerModal() {
    showModalBottomSheet(
      context: context,
      shape: const RoundedRectangleBorder(
        borderRadius: BorderRadius.vertical(top: Radius.circular(24)),
      ),
      builder: (context) {
        return Container(
          padding: const EdgeInsets.all(24),
          child: Column(
            mainAxisSize: MainAxisSize.min,
            crossAxisAlignment: CrossAxisAlignment.start,
            children: [
              Text('Choose a Luxury Theme', style: GoogleFonts.playfairDisplay(fontSize: 18, fontWeight: FontWeight.bold)),
              const SizedBox(height: 16),
              ...MemorialThemes.all.map((t) {
                return ListTile(
                  leading: Container(
                    width: 24,
                    height: 24,
                    decoration: BoxDecoration(color: t.accentColor, shape: BoxShape.circle),
                  ),
                  title: Text(t.name, style: GoogleFonts.inter(fontWeight: FontWeight.w600)),
                  subtitle: Text(t.tagline, style: GoogleFonts.inter(fontSize: 11)),
                  trailing: _selectedThemeId == t.id ? const Icon(Icons.check, color: AppColors.accent) : null,
                  onTap: () {
                    setState(() => _selectedThemeId = t.id);
                    _syncToState();
                    Navigator.pop(context);
                  },
                );
              }),
            ],
          ),
        );
      },
    );
  }
}
