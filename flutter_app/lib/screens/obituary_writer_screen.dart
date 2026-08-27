import 'package:flutter/material.dart';
import 'package:flutter/services.dart';
import 'package:google_fonts/google_fonts.dart';
import '../theme/app_theme.dart';
import '../models/models.dart';
import '../services/memorial_state_service.dart';
import '../services/supabase_service.dart';
import 'prayer_card_editor_screen.dart';
import 'invitation_editor_screen.dart';
import 'thank_you_editor_screen.dart';
import '../widgets/app_navbar.dart';

class ObituaryWriterScreen extends StatefulWidget {
  const ObituaryWriterScreen({super.key});

  @override
  State<ObituaryWriterScreen> createState() => _ObituaryWriterScreenState();
}

class _ObituaryWriterScreenState extends State<ObituaryWriterScreen> {
  late TextEditingController _nameController;
  late TextEditingController _dobController;
  late TextEditingController _dodController;
  late TextEditingController _birthplaceController;
  late TextEditingController _careerController;
  late TextEditingController _survivorsController;
  late TextEditingController _traitsController;

  String _selectedTone = 'Heartfelt & Celebrating Life';
  bool _isGenerating = false;
  String? _generatedText;

  final List<String> _tones = [
    'Heartfelt & Celebrating Life',
    'Traditional & Formal',
    'Sacred & Spiritual',
    'Poetic & Reflective',
    'Concise & Classical',
  ];

  @override
  void initState() {
    super.initState();
    final draft = MemorialStateService.instance.activeMemorial;

    _nameController = TextEditingController(text: draft.name);
    _dobController = TextEditingController(text: draft.birthDate ?? '1942-04-14');
    _dodController = TextEditingController(text: draft.deathDate ?? '2026-08-10');
    _birthplaceController = TextEditingController(text: draft.birthPlace ?? 'Savannah, Georgia');
    _careerController = TextEditingController(text: draft.career ?? 'Dedicated educator and community mentor');
    _survivorsController = TextEditingController(text: draft.survivors ?? 'Devoted children, grandchildren, and lifelong friends');
    _traitsController = TextEditingController(text: draft.personalTraits ?? 'Boundless kindness, wisdom, and radiant warmth');

    if (draft.biography != null && draft.biography!.isNotEmpty) {
      _generatedText = draft.biography;
    }
  }

  @override
  void dispose() {
    _nameController.dispose();
    _dobController.dispose();
    _dodController.dispose();
    _birthplaceController.dispose();
    _careerController.dispose();
    _survivorsController.dispose();
    _traitsController.dispose();
    super.dispose();
  }

  void _syncWithGlobalState() {
    MemorialStateService.instance.updateFields(
      name: _nameController.text.trim(),
      birthDate: _dobController.text.trim(),
      deathDate: _dodController.text.trim(),
      birthPlace: _birthplaceController.text.trim(),
      career: _careerController.text.trim(),
      survivors: _survivorsController.text.trim(),
      personalTraits: _traitsController.text.trim(),
    );
  }

  Future<void> _handleGenerate() async {
    final name = _nameController.text.trim();
    if (name.isEmpty) {
      ScaffoldMessenger.of(context).showSnackBar(
        const SnackBar(content: Text('Please enter your loved one\'s name.')),
      );
      return;
    }

    setState(() => _isGenerating = true);
    _syncWithGlobalState();

    try {
      final text = await SupabaseService.instance.generateAIObituary(
        name: name,
        dob: _dobController.text.trim().isNotEmpty ? _dobController.text.trim() : '1945',
        dod: _dodController.text.trim().isNotEmpty ? _dodController.text.trim() : '2026',
        birthplace: _birthplaceController.text.trim().isNotEmpty ? _birthplaceController.text.trim() : 'Savannah, GA',
        career: _careerController.text.trim().isNotEmpty ? _careerController.text.trim() : 'Dedicated educator and community mentor',
        survivors: _survivorsController.text.trim().isNotEmpty ? _survivorsController.text.trim() : 'Devoted children, grandchildren, and lifelong friends',
        traits: _traitsController.text.trim().isNotEmpty ? _traitsController.text.trim() : 'boundless kindness, wisdom, and radiant warmth',
        tone: _selectedTone,
      );

      // Save and sync with global state & Supabase
      await MemorialStateService.instance.updateFields(
        name: name,
        birthDate: _dobController.text.trim(),
        deathDate: _dodController.text.trim(),
        birthPlace: _birthplaceController.text.trim(),
        career: _careerController.text.trim(),
        survivors: _survivorsController.text.trim(),
        personalTraits: _traitsController.text.trim(),
        biography: text,
        syncWithSupabase: true,
      );

      await SupabaseService.instance.saveObituary(
        Obituary(
          id: 'obit-${DateTime.now().millisecondsSinceEpoch}',
          memorialId: MemorialStateService.instance.activeMemorial.id,
          personName: name,
          tone: _selectedTone,
          content: text,
        ),
      );

      if (mounted) {
        setState(() {
          _generatedText = text;
          _isGenerating = false;
        });
      }
    } catch (e) {
      if (mounted) {
        setState(() => _isGenerating = false);
        ScaffoldMessenger.of(context).showSnackBar(
          SnackBar(content: Text('Error generating obituary: $e')),
        );
      }
    }
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      backgroundColor: AppColors.bgMain,
      appBar: const AppNavbar(activeRoute: '/obituary-writer'),
      drawer: const AppDrawer(),
      body: _generatedText != null ? _buildResultView() : _buildFormWizard(),
    );
  }

  Widget _buildFormWizard() {
    return SingleChildScrollView(
      padding: const EdgeInsets.all(20),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          // Step Header
          Container(
            padding: const EdgeInsets.all(20),
            decoration: BoxDecoration(
              color: Colors.white,
              borderRadius: BorderRadius.circular(24),
              border: Border.all(color: AppColors.borderSubtle),
            ),
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                Row(
                  children: [
                    Container(
                      padding: const EdgeInsets.all(8),
                      decoration: BoxDecoration(
                        color: AppColors.accent.withValues(alpha: 0.15),
                        shape: BoxShape.circle,
                      ),
                      child: const Icon(Icons.auto_awesome, color: AppColors.accent, size: 18),
                    ),
                    const SizedBox(width: 10),
                    Text(
                      'Compassionate Drafting Assistant',
                      style: GoogleFonts.inter(
                        fontSize: 13,
                        fontWeight: FontWeight.bold,
                        color: AppColors.accent,
                      ),
                    ),
                  ],
                ),
                const SizedBox(height: 10),
                Text(
                  'Details entered here automatically synchronize with all funeral programs and templates.',
                  style: GoogleFonts.playfairDisplay(
                    fontSize: 17,
                    fontWeight: FontWeight.bold,
                    color: AppColors.textDark,
                  ),
                ),
              ],
            ),
          ),
          const SizedBox(height: 20),

          // Form fields
          _buildInputField('Full Name of Loved One *', _nameController, 'e.g. Eleanor Vance'),
          const SizedBox(height: 14),

          Row(
            children: [
              Expanded(child: _buildInputField('Date of Birth', _dobController, 'e.g. 1942-04-14')),
              const SizedBox(width: 12),
              Expanded(child: _buildInputField('Date of Passing', _dodController, 'e.g. 2026-08-10')),
            ],
          ),
          const SizedBox(height: 14),

          _buildInputField('Birthplace / Hometown', _birthplaceController, 'e.g. Savannah, Georgia'),
          const SizedBox(height: 14),

          _buildInputField('Career, Passions & Life Milestones', _careerController, 'e.g. Dedicated high school teacher for 35 years, avid master gardener'),
          const SizedBox(height: 14),

          _buildInputField('Surviving Family & Beloved Relatives', _survivorsController, 'e.g. Children Julia and David, 4 grandchildren'),
          const SizedBox(height: 14),

          _buildInputField('Defining Personal Qualities', _traitsController, 'e.g. Infallible kindness, quick wit, devotion to family'),
          const SizedBox(height: 20),

          // Tone Selector
          Text(
            'Narrative Tone',
            style: GoogleFonts.inter(
              fontSize: 13,
              fontWeight: FontWeight.bold,
              color: AppColors.textDark,
            ),
          ),
          const SizedBox(height: 8),
          Container(
            padding: const EdgeInsets.symmetric(horizontal: 16),
            decoration: BoxDecoration(
              color: Colors.white,
              borderRadius: BorderRadius.circular(16),
              border: Border.all(color: AppColors.borderSubtle),
            ),
            child: DropdownButtonHideUnderline(
              child: DropdownButton<String>(
                value: _selectedTone,
                isExpanded: true,
                items: _tones.map((t) => DropdownMenuItem(value: t, child: Text(t))).toList(),
                onChanged: (val) => setState(() => _selectedTone = val ?? _selectedTone),
              ),
            ),
          ),

          const SizedBox(height: 28),

          SizedBox(
            width: double.infinity,
            height: 56,
            child: ElevatedButton.icon(
              onPressed: _isGenerating ? null : _handleGenerate,
              style: ElevatedButton.styleFrom(
                backgroundColor: AppColors.primary,
                shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(18)),
              ),
              icon: _isGenerating
                  ? const SizedBox(
                      width: 20,
                      height: 20,
                      child: CircularProgressIndicator(color: Colors.white, strokeWidth: 2),
                    )
                  : const Icon(Icons.auto_awesome),
              label: Text(
                _isGenerating ? 'Writing Tribute & Syncing to Supabase...' : 'Generate Obituary',
                style: GoogleFonts.inter(fontWeight: FontWeight.bold, fontSize: 16),
              ),
            ),
          ),

          const SizedBox(height: 40),
        ],
      ),
    );
  }

  Widget _buildResultView() {
    return SingleChildScrollView(
      padding: const EdgeInsets.all(20),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          Container(
            padding: const EdgeInsets.all(16),
            decoration: BoxDecoration(
              color: Colors.green.shade50,
              borderRadius: BorderRadius.circular(16),
              border: Border.all(color: Colors.green.shade200),
            ),
            child: Row(
              children: [
                Icon(Icons.check_circle, color: Colors.green.shade700),
                const SizedBox(width: 10),
                Expanded(
                  child: Text(
                    'Obituary generated and auto-synced across all stationery templates.',
                    style: GoogleFonts.inter(fontSize: 13, color: Colors.green.shade900),
                  ),
                ),
              ],
            ),
          ),
          const SizedBox(height: 20),

          Container(
            width: double.infinity,
            padding: const EdgeInsets.all(24),
            decoration: BoxDecoration(
              color: Colors.white,
              borderRadius: BorderRadius.circular(24),
              border: Border.all(color: AppColors.borderSubtle),
              boxShadow: [
                BoxShadow(
                  color: Colors.black.withValues(alpha: 0.04),
                  blurRadius: 15,
                  offset: const Offset(0, 4),
                ),
              ],
            ),
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                Text(
                  _nameController.text.trim(),
                  style: GoogleFonts.playfairDisplay(
                    fontSize: 22,
                    fontWeight: FontWeight.bold,
                    color: AppColors.primary,
                  ),
                ),
                const SizedBox(height: 6),
                Text(
                  '${_dobController.text.trim()} – ${_dodController.text.trim()}',
                  style: GoogleFonts.inter(
                    fontSize: 12,
                    color: AppColors.accent,
                    fontWeight: FontWeight.bold,
                  ),
                ),
                const Divider(height: 32),
                Text(
                  _generatedText ?? '',
                  style: GoogleFonts.inter(
                    fontSize: 15,
                    color: AppColors.textDark,
                    height: 1.7,
                  ),
                ),
              ],
            ),
          ),
          const SizedBox(height: 20),

          // Direct Customization Action Button
          SizedBox(
            width: double.infinity,
            height: 54,
            child: ElevatedButton.icon(
              onPressed: () {
                final draft = MemorialStateService.instance.draft;
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
                Navigator.push(
                  context,
                  MaterialPageRoute(builder: (_) => target),
                );
              },
              style: ElevatedButton.styleFrom(
                backgroundColor: AppColors.accent,
                shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(16)),
              ),
              icon: const Icon(Icons.palette_outlined),
              label: Text(
                'Customize Funeral Programs & Cards',
                style: GoogleFonts.inter(fontWeight: FontWeight.bold, fontSize: 15),
              ),
            ),
          ),
          const SizedBox(height: 12),

          Row(
            children: [
              Expanded(
                child: OutlinedButton.icon(
                  onPressed: () {
                    Clipboard.setData(ClipboardData(text: _generatedText ?? ''));
                    ScaffoldMessenger.of(context).showSnackBar(
                      const SnackBar(content: Text('Obituary copied to clipboard.')),
                    );
                  },
                  style: OutlinedButton.styleFrom(
                    padding: const EdgeInsets.symmetric(vertical: 16),
                    shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(16)),
                  ),
                  icon: const Icon(Icons.copy, size: 18),
                  label: const Text('Copy Text'),
                ),
              ),
              const SizedBox(width: 12),
              Expanded(
                child: OutlinedButton.icon(
                  onPressed: () => setState(() => _generatedText = null),
                  style: OutlinedButton.styleFrom(
                    padding: const EdgeInsets.symmetric(vertical: 16),
                    shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(16)),
                  ),
                  icon: const Icon(Icons.edit, size: 18),
                  label: const Text('Edit Details'),
                ),
              ),
            ],
          ),

          const SizedBox(height: 40),
        ],
      ),
    );
  }

  Widget _buildInputField(String label, TextEditingController controller, String placeholder) {
    return Column(
      crossAxisAlignment: CrossAxisAlignment.start,
      children: [
        Text(
          label,
          style: GoogleFonts.inter(
            fontSize: 12,
            fontWeight: FontWeight.w600,
            color: AppColors.textDark,
          ),
        ),
        const SizedBox(height: 6),
        TextField(
          controller: controller,
          onChanged: (_) => _syncWithGlobalState(),
          decoration: InputDecoration(
            hintText: placeholder,
            hintStyle: GoogleFonts.inter(fontSize: 14, color: AppColors.textMuted.withValues(alpha: 0.6)),
            filled: true,
            fillColor: Colors.white,
            contentPadding: const EdgeInsets.symmetric(horizontal: 16, vertical: 14),
            border: OutlineInputBorder(
              borderRadius: BorderRadius.circular(14),
              borderSide: const BorderSide(color: AppColors.borderSubtle),
            ),
            enabledBorder: OutlineInputBorder(
              borderRadius: BorderRadius.circular(14),
              borderSide: const BorderSide(color: AppColors.borderSubtle),
            ),
          ),
        ),
      ],
    );
  }
}
