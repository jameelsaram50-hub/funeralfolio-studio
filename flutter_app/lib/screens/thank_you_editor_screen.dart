import 'package:flutter/material.dart';
import 'package:google_fonts/google_fonts.dart';
import '../theme/app_theme.dart';
import '../services/memorial_state_service.dart';
import 'checkout_screen.dart';

class ThankYouEditorScreen extends StatefulWidget {
  final String? initialThemeId;

  const ThankYouEditorScreen({
    super.key,
    this.initialThemeId,
  });

  @override
  State<ThankYouEditorScreen> createState() => _ThankYouEditorScreenState();
}

class _ThankYouEditorScreenState extends State<ThankYouEditorScreen> {
  int _currentStep = 1;
  late String _selectedThemeId;

  late TextEditingController _nameController;
  late TextEditingController _thankYouMessageController;
  late TextEditingController _signatureController;
  late TextEditingController _photoUrlController;

  final List<String> _messagePresets = [
    'The family of the late honoree deeply appreciates your comforting words, prayers, and heartfelt support during our time of sorrow.',
    'Thank you sincerely for your sympathy, beautiful flowers, and being here to celebrate a life so dearly loved.',
    'Your presence and warm condolences brought us immense peace and strength. Thank you from the bottom of our hearts.',
  ];

  @override
  void initState() {
    super.initState();
    final draft = MemorialStateService.instance.draft;
    _selectedThemeId = widget.initialThemeId ?? draft.themeId ?? 'celestial-gold';

    _nameController = TextEditingController(text: draft.name);
    _thankYouMessageController = TextEditingController(text: draft.quote ?? _messagePresets[0]);
    _signatureController = TextEditingController(text: 'With sincere gratitude,\nThe Henderson Family');
    _photoUrlController = TextEditingController(text: draft.photoUrl ?? 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?q=80&w=600&auto=format&fit=crop');
  }

  void _syncToState() {
    MemorialStateService.instance.updateDraft(
      name: _nameController.text,
      quote: _thankYouMessageController.text,
      photoUrl: _photoUrlController.text,
      themeId: _selectedThemeId,
      productId: 'thank-you',
    );
  }

  @override
  void dispose() {
    _nameController.dispose();
    _thankYouMessageController.dispose();
    _signatureController.dispose();
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
              'Customizing 4" x 6" Thank You Card',
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
    final previewContent = Container(
      width: 440,
      height: 260,
      padding: const EdgeInsets.all(20),
      decoration: BoxDecoration(
        color: theme.cardBg,
        borderRadius: BorderRadius.circular(16),
        border: Border.all(color: theme.accentColor, width: 2),
        boxShadow: [
          BoxShadow(
            color: Colors.black.withValues(alpha: 0.12),
            blurRadius: 20,
            offset: const Offset(0, 8),
          ),
        ],
      ),
      child: Row(
        children: [
          // Left Photo
          Container(
            width: 80,
            height: 80,
            decoration: BoxDecoration(
              shape: BoxShape.circle,
              border: Border.all(color: theme.accentColor, width: 2),
            ),
            child: ClipOval(
              child: _photoUrlController.text.isNotEmpty
                  ? Image.network(
                      _photoUrlController.text,
                      fit: BoxFit.cover,
                      errorBuilder: (context, error, stackTrace) => Icon(Icons.person, size: 45, color: theme.accentColor),
                    )
                  : Icon(Icons.person, size: 45, color: theme.accentColor),
            ),
          ),
          const SizedBox(width: 16),
          // Right Text
          Expanded(
            child: Column(
              mainAxisAlignment: MainAxisAlignment.center,
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                Text(
                  'WITH SINCERE GRATITUDE',
                  style: GoogleFonts.inter(
                    fontSize: 9,
                    letterSpacing: 2,
                    fontWeight: FontWeight.bold,
                    color: theme.accentColor,
                  ),
                ),
                const SizedBox(height: 4),
                Text(
                  'Remembering ${_nameController.text}',
                  style: GoogleFonts.playfairDisplay(
                    fontSize: 15,
                    fontWeight: FontWeight.bold,
                    color: theme.textColor,
                  ),
                ),
                const SizedBox(height: 6),
                Text(
                  _thankYouMessageController.text,
                  maxLines: 4,
                  overflow: TextOverflow.ellipsis,
                  style: GoogleFonts.inter(
                    fontSize: 9,
                    height: 1.35,
                    color: theme.textColor.withValues(alpha: 0.85),
                  ),
                ),
                const SizedBox(height: 8),
                Text(
                  _signatureController.text,
                  style: GoogleFonts.playfairDisplay(
                    fontSize: 10,
                    fontStyle: FontStyle.italic,
                    color: theme.accentColor,
                  ),
                ),
              ],
            ),
          ),
        ],
      ),
    );

    if (isWide) {
      return Column(
        children: [
          Container(
            padding: const EdgeInsets.symmetric(horizontal: 14, vertical: 6),
            decoration: BoxDecoration(
              color: Colors.white,
              borderRadius: BorderRadius.circular(12),
              border: Border.all(color: AppColors.borderSubtle),
            ),
            child: Text(
              '4" x 6" FLAT ACKNOWLEDGEMENT CARD',
              style: GoogleFonts.inter(fontSize: 10, fontWeight: FontWeight.bold, color: AppColors.accent, letterSpacing: 1),
            ),
          ),
          const SizedBox(height: 16),
          Expanded(
            child: Center(
              child: FittedBox(
                fit: BoxFit.contain,
                child: previewContent,
              ),
            ),
          ),
        ],
      );
    }

    return Column(
      children: [
        Container(
          padding: const EdgeInsets.symmetric(horizontal: 14, vertical: 6),
          decoration: BoxDecoration(
            color: Colors.white,
            borderRadius: BorderRadius.circular(12),
            border: Border.all(color: AppColors.borderSubtle),
          ),
          child: Text(
            '4" x 6" FLAT ACKNOWLEDGEMENT CARD',
            style: GoogleFonts.inter(fontSize: 10, fontWeight: FontWeight.bold, color: AppColors.accent, letterSpacing: 1),
          ),
        ),
        const SizedBox(height: 16),
        Center(
          child: FittedBox(
            fit: BoxFit.contain,
            child: previewContent,
          ),
        ),
      ],
    );
  }

  Widget _buildStepForm() {
    return Padding(
      padding: const EdgeInsets.all(20),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          Text(
            _currentStep == 1 ? 'Step 1: Honoree & Photo' : 'Step 2: Gratitude Message & Signature',
            style: GoogleFonts.playfairDisplay(fontSize: 16, fontWeight: FontWeight.bold),
          ),
          const SizedBox(height: 16),
          Expanded(
            child: SingleChildScrollView(
              child: _currentStep == 1
                  ? Column(
                      children: [
                        _buildTextField('Honoree Name', _nameController),
                        const SizedBox(height: 12),
                        _buildTextField('Portrait Image URL', _photoUrlController),
                      ],
                    )
                  : Column(
                      crossAxisAlignment: CrossAxisAlignment.start,
                      children: [
                        Text('Choose Preset Message:', style: GoogleFonts.inter(fontSize: 12, fontWeight: FontWeight.bold)),
                        const SizedBox(height: 8),
                        ..._messagePresets.map((msg) {
                          return Padding(
                            padding: const EdgeInsets.only(bottom: 6),
                            child: OutlinedButton(
                              onPressed: () => setState(() => _thankYouMessageController.text = msg),
                              style: OutlinedButton.styleFrom(
                                padding: const EdgeInsets.all(10),
                                side: const BorderSide(color: AppColors.borderSubtle),
                              ),
                              child: Text(msg, maxLines: 2, overflow: TextOverflow.ellipsis, style: GoogleFonts.inter(fontSize: 11)),
                            ),
                          );
                        }),
                        const SizedBox(height: 12),
                        _buildTextField('Custom Gratitude Message', _thankYouMessageController, maxLines: 4),
                        const SizedBox(height: 12),
                        _buildTextField('Family Signature Line', _signatureController),
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
                child: Text(_currentStep == 1 ? 'Next: Message' : 'Finalize & Order Prints'),
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
