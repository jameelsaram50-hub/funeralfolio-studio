import 'package:flutter/material.dart';
import 'package:google_fonts/google_fonts.dart';
import '../theme/app_theme.dart';
import '../models/models.dart';
import '../services/supabase_service.dart';
import '../services/memorial_state_service.dart';

class CheckoutScreen extends StatefulWidget {
  final String productName;
  final String themeId;

  const CheckoutScreen({
    super.key,
    this.productName = 'Funeral Program',
    this.themeId = 'celestial-gold',
  });

  @override
  State<CheckoutScreen> createState() => _CheckoutScreenState();
}

class _CheckoutScreenState extends State<CheckoutScreen> {
  int _selectedTierIndex = 1; // Default to Standard Printed Keepsakes
  final _nameController = TextEditingController();
  final _emailController = TextEditingController();
  final _addressController = TextEditingController();
  final _phoneController = TextEditingController();
  bool _isPlacingOrder = false;
  Order? _completedOrder;

  final List<Map<String, dynamic>> _tiers = [
    {
      'title': 'Digital Print-Ready PDF',
      'price': 29.00,
      'badge': 'INSTANT ACCESS',
      'desc': 'High-resolution 300 DPI vector PDF download + Digital Memorial Web Tribute.',
      'features': [
        'Instant 300 DPI Print-Ready PDF',
        'Includes All Pages & Custom Layouts',
        'Digital Memorial Page Included',
        'Unlimited Online Condolences',
      ],
    },
    {
      'title': 'Printed Keepsakes (100 Prints)',
      'price': 89.00,
      'badge': 'MOST POPULAR',
      'desc': '100 Premium 130lb Linen cardstock prints delivered directly to your doorstep.',
      'features': [
        '100 Foil-Accented Printed Stationery',
        'Luxury 130lb Heavyweight Linen Stock',
        'Digital Print PDF & Web Tribute Included',
        'Free 2-Day Priority Express Shipping',
      ],
    },
    {
      'title': 'Complete Coordinated Legacy Suite',
      'price': 149.00,
      'badge': 'FULL CEREMONY SUITE',
      'desc': 'Complete package: 100 Programs, 100 Prayer Cards, 50 Thank You Cards, and 24x36 Poster Board.',
      'features': [
        '100 Bi-fold Funeral Programs',
        '100 Laminated Holy Prayer Cards',
        '50 Foil-Stamped Gratitude Cards',
        '24" x 36" Easel Celebration Poster',
        'Free Overnight Guaranteed Delivery',
      ],
    },
  ];

  @override
  void initState() {
    super.initState();
    final draft = MemorialStateService.instance.draft;
    _nameController.text = 'Family of ${draft.name}';
    _emailController.text = 'family.${draft.name.toLowerCase().replaceAll(' ', '')}@example.com';
    _addressController.text = '742 Evergreen Terrace, Savannah, GA 31401';
    _phoneController.text = '+1 (555) 234-5678';
  }

  Future<void> _handlePlaceOrder() async {
    if (_nameController.text.trim().isEmpty || _emailController.text.trim().isEmpty) {
      ScaffoldMessenger.of(context).showSnackBar(
        const SnackBar(content: Text('Please enter your name and email address.')),
      );
      return;
    }

    setState(() => _isPlacingOrder = true);

    final selected = _tiers[_selectedTierIndex];
    final draft = MemorialStateService.instance.draft;

    final order = Order(
      id: 'ORD-${DateTime.now().millisecondsSinceEpoch.toString().substring(7)}',
      customerName: _nameController.text.trim(),
      customerEmail: _emailController.text.trim(),
      packageName: '${draft.name} - ${selected['title']}',
      amount: selected['price'] as double,
      status: _selectedTierIndex == 0 ? 'Paid' : 'In Production',
      trackingNumber: _selectedTierIndex == 0 ? null : '9400111899${DateTime.now().millisecond}',
      downloadUrl: 'https://funeralfolio.com/downloads/${draft.name.toLowerCase().replaceAll(' ', '-')}-suite.pdf',
      createdAt: DateTime.now(),
    );

    // Save to Supabase and local cache
    await SupabaseService.instance.saveOrder(order);

    if (mounted) {
      setState(() {
        _isPlacingOrder = false;
        _completedOrder = order;
      });
    }
  }

  @override
  Widget build(BuildContext context) {
    if (_completedOrder != null) {
      return _buildSuccessScreen();
    }

    final selectedTier = _tiers[_selectedTierIndex];

    return Scaffold(
      backgroundColor: AppColors.bgMain,
      appBar: AppBar(
        title: Text(
          'Complete Stationery Order',
          style: GoogleFonts.playfairDisplay(fontWeight: FontWeight.bold),
        ),
      ),
      body: SingleChildScrollView(
        padding: const EdgeInsets.all(20),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            // Order Summary Header
            Container(
              padding: const EdgeInsets.all(20),
              decoration: BoxDecoration(
                gradient: const LinearGradient(
                  colors: [AppColors.primary, Color(0xFF0F172A)],
                  begin: Alignment.topLeft,
                  end: Alignment.bottomRight,
                ),
                borderRadius: BorderRadius.circular(20),
              ),
              child: Row(
                children: [
                  Container(
                    width: 50,
                    height: 50,
                    decoration: BoxDecoration(
                      color: AppColors.accent.withValues(alpha: 0.2),
                      borderRadius: BorderRadius.circular(14),
                    ),
                    child: const Icon(Icons.shopping_bag_outlined, color: AppColors.accent, size: 28),
                  ),
                  const SizedBox(width: 16),
                  Expanded(
                    child: Column(
                      crossAxisAlignment: CrossAxisAlignment.start,
                      children: [
                        Text(
                          'Checkout: ${widget.productName}',
                          style: GoogleFonts.playfairDisplay(fontSize: 18, fontWeight: FontWeight.bold, color: Colors.white),
                        ),
                        const SizedBox(height: 4),
                        Text(
                          'Honoring ${MemorialStateService.instance.draft.name}',
                          style: GoogleFonts.inter(fontSize: 13, color: AppColors.accent, fontWeight: FontWeight.w600),
                        ),
                      ],
                    ),
                  ),
                ],
              ),
            ),
            const SizedBox(height: 24),

            // Package Tier Selection
            Text(
              'Select Printing & Fulfillment Tier',
              style: GoogleFonts.playfairDisplay(fontSize: 18, fontWeight: FontWeight.bold, color: AppColors.textDark),
            ),
            const SizedBox(height: 12),
            ..._tiers.asMap().entries.map((entry) {
              final idx = entry.key;
              final tier = entry.value;
              final isSelected = _selectedTierIndex == idx;

              return GestureDetector(
                onTap: () => setState(() => _selectedTierIndex = idx),
                child: Container(
                  margin: const EdgeInsets.only(bottom: 14),
                  padding: const EdgeInsets.all(18),
                  decoration: BoxDecoration(
                    color: isSelected ? AppColors.accent.withValues(alpha: 0.06) : Colors.white,
                    borderRadius: BorderRadius.circular(18),
                    border: Border.all(
                      color: isSelected ? AppColors.accent : AppColors.borderSubtle,
                      width: isSelected ? 2.5 : 1,
                    ),
                    boxShadow: isSelected
                        ? [BoxShadow(color: AppColors.accent.withValues(alpha: 0.12), blurRadius: 16, offset: const Offset(0, 4))]
                        : [],
                  ),
                  child: Column(
                    crossAxisAlignment: CrossAxisAlignment.start,
                    children: [
                      Row(
                        mainAxisAlignment: MainAxisAlignment.spaceBetween,
                        children: [
                          Container(
                            padding: const EdgeInsets.symmetric(horizontal: 10, vertical: 4),
                            decoration: BoxDecoration(
                              color: isSelected ? AppColors.accent : AppColors.bgSurface,
                              borderRadius: BorderRadius.circular(10),
                            ),
                            child: Text(
                              tier['badge'],
                              style: GoogleFonts.inter(
                                fontSize: 10,
                                fontWeight: FontWeight.bold,
                                color: isSelected ? Colors.white : AppColors.primary,
                              ),
                            ),
                          ),
                          Text(
                            '\$${(tier['price'] as double).toStringAsFixed(0)}',
                            style: GoogleFonts.playfairDisplay(
                              fontSize: 22,
                              fontWeight: FontWeight.bold,
                              color: AppColors.textDark,
                            ),
                          ),
                        ],
                      ),
                      const SizedBox(height: 10),
                      Text(
                        tier['title'],
                        style: GoogleFonts.playfairDisplay(fontSize: 16, fontWeight: FontWeight.bold, color: AppColors.textDark),
                      ),
                      const SizedBox(height: 4),
                      Text(tier['desc'], style: GoogleFonts.inter(fontSize: 12, color: AppColors.textMuted)),
                      const SizedBox(height: 12),
                      ...(tier['features'] as List<String>).map((f) => Padding(
                            padding: const EdgeInsets.only(bottom: 4),
                            child: Row(
                              children: [
                                const Icon(Icons.check_circle, size: 14, color: AppColors.accent),
                                const SizedBox(width: 8),
                                Expanded(child: Text(f, style: GoogleFonts.inter(fontSize: 12, color: AppColors.textDark))),
                              ],
                            ),
                          )),
                    ],
                  ),
                ),
              );
            }),

            const SizedBox(height: 20),
            // Shipping Details Form
            Text(
              'Recipient & Delivery Information',
              style: GoogleFonts.playfairDisplay(fontSize: 18, fontWeight: FontWeight.bold, color: AppColors.textDark),
            ),
            const SizedBox(height: 12),
            Container(
              padding: const EdgeInsets.all(20),
              decoration: BoxDecoration(
                color: Colors.white,
                borderRadius: BorderRadius.circular(20),
                border: Border.all(color: AppColors.borderSubtle),
              ),
              child: Column(
                children: [
                  TextField(
                    controller: _nameController,
                    decoration: InputDecoration(
                      labelText: 'Contact / Family Name *',
                      prefixIcon: const Icon(Icons.person_outline, color: AppColors.accent),
                      border: OutlineInputBorder(borderRadius: BorderRadius.circular(12)),
                    ),
                  ),
                  const SizedBox(height: 14),
                  TextField(
                    controller: _emailController,
                    decoration: InputDecoration(
                      labelText: 'Email Address for PDF & Tracking *',
                      prefixIcon: const Icon(Icons.mail_outline, color: AppColors.accent),
                      border: OutlineInputBorder(borderRadius: BorderRadius.circular(12)),
                    ),
                  ),
                  const SizedBox(height: 14),
                  TextField(
                    controller: _addressController,
                    decoration: InputDecoration(
                      labelText: 'Delivery Address (Chapel or Residence)',
                      prefixIcon: const Icon(Icons.local_shipping_outlined, color: AppColors.accent),
                      border: OutlineInputBorder(borderRadius: BorderRadius.circular(12)),
                    ),
                  ),
                  const SizedBox(height: 14),
                  TextField(
                    controller: _phoneController,
                    decoration: InputDecoration(
                      labelText: 'Contact Phone Number',
                      prefixIcon: const Icon(Icons.phone_outlined, color: AppColors.accent),
                      border: OutlineInputBorder(borderRadius: BorderRadius.circular(12)),
                    ),
                  ),
                ],
              ),
            ),
            const SizedBox(height: 24),

            // Total & Submit
            Container(
              padding: const EdgeInsets.all(20),
              decoration: BoxDecoration(
                color: Colors.white,
                borderRadius: BorderRadius.circular(20),
                border: Border.all(color: AppColors.borderSubtle),
              ),
              child: Column(
                children: [
                  Row(
                    mainAxisAlignment: MainAxisAlignment.spaceBetween,
                    children: [
                      Text('Selected Package:', style: GoogleFonts.inter(fontSize: 14, color: AppColors.textMuted)),
                      Text(selectedTier['title'], style: GoogleFonts.inter(fontSize: 14, fontWeight: FontWeight.bold)),
                    ],
                  ),
                  const SizedBox(height: 8),
                  Row(
                    mainAxisAlignment: MainAxisAlignment.spaceBetween,
                    children: [
                      Text('Priority Shipping:', style: GoogleFonts.inter(fontSize: 14, color: AppColors.textMuted)),
                      Text('FREE Express', style: GoogleFonts.inter(fontSize: 14, fontWeight: FontWeight.bold, color: Colors.green.shade700)),
                    ],
                  ),
                  const Divider(height: 24),
                  Row(
                    mainAxisAlignment: MainAxisAlignment.spaceBetween,
                    children: [
                      Text('Total Amount:', style: GoogleFonts.playfairDisplay(fontSize: 18, fontWeight: FontWeight.bold)),
                      Text('\$${(selectedTier['price'] as double).toStringAsFixed(2)}', style: GoogleFonts.playfairDisplay(fontSize: 24, fontWeight: FontWeight.bold, color: AppColors.primary)),
                    ],
                  ),
                  const SizedBox(height: 18),
                  SizedBox(
                    width: double.infinity,
                    child: ElevatedButton.icon(
                      onPressed: _isPlacingOrder ? null : _handlePlaceOrder,
                      style: ElevatedButton.styleFrom(
                        backgroundColor: AppColors.accent,
                        foregroundColor: AppColors.primary,
                        padding: const EdgeInsets.symmetric(vertical: 18),
                        shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(14)),
                      ),
                      icon: _isPlacingOrder
                          ? const SizedBox(width: 20, height: 20, child: CircularProgressIndicator(strokeWidth: 2, color: AppColors.primary))
                          : const Icon(Icons.lock_outline),
                      label: Text(
                        _isPlacingOrder ? 'Processing & Syncing Order...' : 'Complete & Place Order',
                        style: GoogleFonts.inter(fontWeight: FontWeight.bold, fontSize: 16),
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

  Widget _buildSuccessScreen() {
    final o = _completedOrder!;

    return Scaffold(
      backgroundColor: AppColors.bgMain,
      appBar: AppBar(
        title: Text('Order Confirmed', style: GoogleFonts.playfairDisplay(fontWeight: FontWeight.bold)),
      ),
      body: SingleChildScrollView(
        padding: const EdgeInsets.all(24),
        child: Column(
          children: [
            Container(
              padding: const EdgeInsets.all(28),
              decoration: BoxDecoration(
                color: Colors.white,
                borderRadius: BorderRadius.circular(24),
                border: Border.all(color: Colors.green.shade200),
                boxShadow: [
                  BoxShadow(color: Colors.green.withValues(alpha: 0.08), blurRadius: 20, offset: const Offset(0, 6)),
                ],
              ),
              child: Column(
                children: [
                  Container(
                    width: 72,
                    height: 72,
                    decoration: BoxDecoration(color: Colors.green.shade50, shape: BoxShape.circle),
                    child: Icon(Icons.check_circle, size: 48, color: Colors.green.shade700),
                  ),
                  const SizedBox(height: 18),
                  Text(
                    'Order Successfully Placed!',
                    style: GoogleFonts.playfairDisplay(fontSize: 22, fontWeight: FontWeight.bold, color: AppColors.textDark),
                  ),
                  const SizedBox(height: 8),
                  Text(
                    'Order Confirmation ID: ${o.id}',
                    style: GoogleFonts.inter(fontWeight: FontWeight.bold, color: AppColors.accent, fontSize: 14),
                  ),
                  const SizedBox(height: 16),
                  Text(
                    'Your stationery print order has been queued for production and recorded directly in Supabase cloud database.',
                    textAlign: TextAlign.center,
                    style: GoogleFonts.inter(fontSize: 13, color: AppColors.textMuted, height: 1.5),
                  ),
                  const Divider(height: 32),
                  ListTile(
                    leading: const Icon(Icons.mail, color: AppColors.primary),
                    title: Text(o.customerEmail, style: GoogleFonts.inter(fontWeight: FontWeight.w600, fontSize: 13)),
                    subtitle: const Text('Confirmation & Tracking Email Sent'),
                    dense: true,
                  ),
                  if (o.trackingNumber != null)
                    ListTile(
                      leading: const Icon(Icons.local_shipping, color: AppColors.primary),
                      title: Text('Tracking: ${o.trackingNumber}', style: GoogleFonts.inter(fontWeight: FontWeight.w600, fontSize: 13)),
                      subtitle: const Text('Priority 2-Day Air Delivery'),
                      dense: true,
                    ),
                  const SizedBox(height: 24),
                  SizedBox(
                    width: double.infinity,
                    child: ElevatedButton.icon(
                      onPressed: () {
                        ScaffoldMessenger.of(context).showSnackBar(
                          const SnackBar(content: Text('Downloading 300 DPI Print PDF Package...')),
                        );
                      },
                      style: ElevatedButton.styleFrom(
                        backgroundColor: AppColors.primary,
                        foregroundColor: Colors.white,
                        padding: const EdgeInsets.symmetric(vertical: 16),
                        shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(14)),
                      ),
                      icon: const Icon(Icons.download),
                      label: Text('Download 300 DPI Print Package', style: GoogleFonts.inter(fontWeight: FontWeight.bold)),
                    ),
                  ),
                  const SizedBox(height: 12),
                  SizedBox(
                    width: double.infinity,
                    child: OutlinedButton(
                      onPressed: () => Navigator.pop(context),
                      style: OutlinedButton.styleFrom(
                        padding: const EdgeInsets.symmetric(vertical: 14),
                        shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(14)),
                      ),
                      child: const Text('Return to Suite'),
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
